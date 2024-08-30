"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from api.utils import APIException, generate_sitemap
from api.models import db
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands
from api.models import Post
from api.models import User

# from models import Person

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../public/')
app = Flask(__name__)
app.url_map.strict_slashes = False

# database condiguration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace(
        "postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# add the admin
setup_admin(app)

# add the admin
setup_commands(app)

# Add all endpoints form the API with a "api" prefix
app.register_blueprint(api, url_prefix='/api')

# Handle/serialize errors like a JSON object


@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# generate sitemap with all your endpoints


@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# any other endpoint will try to serve it like a static file


@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # avoid cache memory
    return response

# Crear un nuevo post
@app.route('/users/all', methods=['GET'])
def handle_get_all():
    
    all_users = User.query.all()
    
    all_users = list(map(lambda user: user.serialize(),all_users ))
    
    
    return jsonify(all_users),200

@app.route('/users/create', methods=['POST'])
def create_user():
    try:
        data = request.get_json()
        new_user = User(
            email=data['email'],
            password=data['password'],  # Considera encriptar el password
            username=data['username'],
            is_active=data.get('is_active', True)
        )
        db.session.add(new_user)
        db.session.commit()
        return jsonify(new_user.serialize()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    
@app.route('/users/get_user/<int:id>', methods=['GET'])
def handle_get_user(id):
    try:
        # Buscar el usuario en la base de datos por ID
        user = User.query.get(id)
        
        # Verificar si el usuario existe
        if user is None:
            return jsonify({"error": "User not found"}), 404
        
        # Devolver los datos del usuario en formato JSON
        return jsonify(user.serialize()), 200
    
    except Exception as e:
        # En caso de un error, devolver un mensaje de error y un código 500
        return jsonify({"error": str(e)}), 500
    
@app.route('/users/get_user_by_email/<string:email>', methods=['GET'])
def handle_get_user_by_email(email):
    try:
        # Buscar el usuario en la base de datos por email
        user = User.query.filter_by(email=email).first()
        
        # Verificar si el usuario existe
        if user is None:
            return jsonify({"error": "User not found"}), 404
        
        # Devolver los datos del usuario en formato JSON
        return jsonify(user.serialize()), 200
    
    except Exception as e:
        # En caso de un error, devolver un mensaje de error y un código 500
        return jsonify({"error": str(e)}), 500    

@app.route('/users/delete/<int:id>', methods=['DELETE'])
def handle_delete_user(id):
    try:
        # Buscar el usuario en la base de datos por ID
        user = User.query.get(id)
        
        # Verificar si el usuario existe
        if user is None:
            return jsonify({"error": "User not found"}), 404
        
        # Eliminar el usuario de la base de datos
        db.session.delete(user)
        db.session.commit()
        
        # Devolver un mensaje de éxito
        return jsonify({"message": "User deleted successfully"}), 200
    
    except Exception as e:
        # En caso de un error, devolver un mensaje de error y un código 500
        return jsonify({"error": str(e)}), 500
 
@app.route('/posts', methods=['POST'])
def create_post():
    data = request.get_json()
    new_post = Post(title=data['title'], content=data['content'], user_id=data['user_id'])
    db.session.add(new_post)
    db.session.commit()
    return jsonify(new_post.serialize()), 201

# Obtener todos los posts
@app.route('/posts', methods=['GET'])
def get_posts():
    posts = Post.query.all()
    return jsonify([post.serialize() for post in posts]), 200

# Obtener un post por ID
@app.route('/posts/<int:post_id>', methods=['GET'])
def get_post(post_id):
    post = Post.query.get(post_id)
    if post is None:
        return jsonify({"error": "Post not found"}), 404
    return jsonify(post.serialize()), 200

# Actualizar un post por ID
@app.route('/posts/<int:post_id>', methods=['PUT'])
def update_post(post_id):
    post = Post.query.get(post_id)
    if post is None:
        return jsonify({"error": "Post not found"}), 404
    data = request.get_json()
    post.title = data.get('title', post.title)
    post.content = data.get('content', post.content)
    post.user_id = data.get('user_id', post.user_id)
    db.session.commit()
    return jsonify(post.serialize()), 200

# Eliminar un post por ID
@app.route('/posts/<int:post_id>', methods=['DELETE'])
def delete_post(post_id):
    post = Post.query.get(post_id)
    if post is None:
        return jsonify({"error": "Post not found"}), 404
    db.session.delete(post)
    db.session.commit()
    return jsonify({"message": "Post deleted"}), 200

# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
