const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			users: [], // Lista de usuarios
			post: [],   // Lista de posts
			postsUser:[]
		},
		actions: {
			// Función para obtener un mensaje del backend
			getMessage: async () => {
				try {
					// Reemplaza 'process.env.BACKEND_URL' con la URL de tu backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello");
					const data = await resp.json();
					setStore({ message: data.message });
					// No olvides retornar algo para que la función async se resuelva
					return data;
				} catch (error) {
					console.log("Error cargando el mensaje desde el backend", error);
				}
			},

			// Función para obtener una lista de usuarios
			getUsers: async () => {
				try {
					// Asegúrate de ajustar la URL según tu configuración
					const response = await fetch('https://ubiquitous-space-journey-g449g746v5rr2p77-3001.app.github.dev/users/all');
					
					if (!response.ok) {
						throw new Error('Error al obtener los usuarios');
					}
					const data = await response.json();
					setStore({ users: data }); // Actualiza el estado con la lista de usuarios
				} catch (error) {
					console.error('Error al obtener los usuarios:', error);
				}
			},

			// Función para obtener posts
			getPost: async () => {
				try {
					// Reemplaza 'url' con el endpoint real de tu API
					const response = await fetch('https://ubiquitous-space-journey-g449g746v5rr2p77-3001.app.github.dev/posts');
					if (!response.ok) {
						throw new Error('La respuesta de la red no fue correcta');
					}
					const data = await response.json();
					setStore({ post: data });
					return data;
				} catch (error) {
					console.error('Hubo un problema con la operación de fetch:', error);
					return null; // Maneja el error según sea necesario
				}
			},
		 getPostsUser : async (id) => {
				try {
						// Realizar la solicitud al endpoint de la API
						const response = await fetch(`https://ubiquitous-space-journey-g449g746v5rr2p77-3001.app.github.dev/users/${id}/posts`);
		
						// Verificar si la respuesta es correcta
						if (!response.ok) {
								throw new Error(`Error ${response.status}: ${response.statusText}`);
						}
		
						// Convertir la respuesta a JSON
						const data = await response.json();
						setStore({postsUser: data }); 
						
						// Opcional: Si estás utilizando un estado, actualízalo aquí
						// setStore({ posts: data }); // Ejemplo de cómo podrías actualizar el estado
		
						return data; // Retorna los datos obtenidos
				} catch (error) {
						// Manejar el error (puedes actualizar el estado con un mensaje de error, etc.)
						console.error('Error al obtener los posts del usuario:', error);
						return null; // O maneja el error de la manera que prefieras
				}
		},
		}
	};
};

export default getState;
