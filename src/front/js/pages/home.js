import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import rigoImageUrl from "../../img/rigo-baby.jpg";
import "../../styles/home.css";

export const Home = () => {
    const { store, actions } = useContext(Context);

    // Llama a getUsers cuando el componente se monta
    useEffect(() => {
        actions.getUsers(); 
        actions.getPost(); // Asegúrate de que esta función está implementada en tu store
        actions.getPostsUser(3);
    }, []);  // [] asegura que solo se llama una vez al montar el componente
 console.log(store.users)
 console.log(store)
    return (
        <div className="text-center mt-5">
            <h1>Post User feel !!</h1>
        
            {/* Renderiza la lista de usuarios */}
			<div className="container">
			<div className="row">
			<div className="col list">
            <div className="mt-4">
                <h2>Users List</h2>
                {store.users.length > 0 ? (
                    <ul className="list-group">
                        {store.users.map(user => (
                            <li key={user.id} className="list-group-item">
                               {user.user_name}-{user.id}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No users available</p>
                )}
            </div>
						</div>
						<div className="col post mt-4">
                        <h2>Publicaciones</h2>
                        {store.post.length > 0 ? (
                    <ul className="list-group">
                        {store.post.map(post => (
                            <li key={post.id} className="list-group-item">
                             {post.title}...  {post.content} - {post.user_id}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No users available</p>
                )}
						</div>
						
				</div>
			</div>
        </div>
    );
};
