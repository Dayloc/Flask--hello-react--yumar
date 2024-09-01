import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";

export const Home = () => {
    const { store, actions } = useContext(Context);

    // Llama a getUsers, getPost y getPostsUser cuando el componente se monta
    useEffect(() => {
        actions.getUsers(); 
        actions.getPost(); // Asegúrate de que esta función está implementada en tu store
        actions.getPostsUser(3);
    }, []);  // [] asegura que solo se llama una vez al montar el componente

    console.log(store.users);
    console.log(store);

    return (
        <div className="container text-center mt-5">
            <h1>Post User Feel !!</h1>
            
            {/* Tarjeta */}
            <div className="card mx-auto" style={{ width: '18rem' }}>
                <div className="card-body">
                    <h5 className="card-title">Card Title</h5>
                    <h6 className="card-subtitle mb-2 text-body-secondary">Card Subtitle</h6>
                    <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                    <a href="#" className="card-link">Card Link</a>
                    <a href="#" className="card-link">Another Link</a>
                </div>
            </div>
        
            {/* Lista de usuarios */}
            <div className="mt-4">
                <h2>Users List</h2>
                {store.users.length > 0 ? (
                    <ul className="list-group mx-auto" style={{ maxWidth: '600px' }}>
                        {store.users.map(user => (
                            <li key={user.id} className="list-group-item">
                                {user.user_name} - {user.id}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No users available</p>
                )}
            </div>
            
            {/* Publicaciones */}
            <div className="mt-4 ">
                <h2>Publicaciones</h2>
                {store.post.length > 0 ? (
                    <ul className="list-group  mx-auto " style={{ maxWidth: '600px' }}>
                        {store.post.map(post => (
                            <li key={post.id} className="list-group-item bg-dark post mt-4 rounded ">
                              
                                <div className="card mx-auto " style={{ width: '18rem' }}>
                <div className="card-body  ">
                    <h5 className="card-title">{post.title} </h5>
                    <h6 className="card-subtitle mb-2 text-body-secondary">{post.user_id}</h6>
                    <p className="card-text"> {post.content}</p>
                    <a href="#" className="card-link">Card Link</a>
                    <a href="#" className="card-link">Another Link</a>
                </div>
            </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No posts available</p>
                )}
            </div>
        </div>
    );
};
