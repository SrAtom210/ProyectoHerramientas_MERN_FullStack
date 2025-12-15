import axios from 'axios';

// ⚠️ AQUÍ ESTÁ EL ARREGLO DEL NETWORK ERROR
// Usa tu dominio real y el puerto 8000 (o 5000 si usaste ese en el backend)
const API_URL = 'http://penrose512.jcarlos19.com:8000/api/usuarios/';

// Registrar usuario
const registro = async (userData) => {
    const respuesta = await axios.post(API_URL, userData);

    if(respuesta.data){
        localStorage.setItem('user', JSON.stringify(respuesta.data));
    }
    return respuesta.data;
};

// Login de usuario
const login = async (userData) => {
    const respuesta = await axios.post(API_URL + 'login', userData);

    if(respuesta.data){
        localStorage.setItem('user', JSON.stringify(respuesta.data));
    }
    return respuesta.data;
};

// Logout
const logout = () => {
    localStorage.removeItem('user');
};

// Actualizar perfil de usuario
const actualizarPerfil = async (userData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    // PUT a /api/usuarios/perfil
    const response = await axios.put(API_URL + 'perfil', userData, config);

    // Actualizamos el localStorage con los nuevos datos
    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }

    return response.data;
};

const authService = {
    registro, // <--- AQUÍ ESTÁ EL ARREGLO DE "IS NOT A FUNCTION"
    login,
    logout,
    actualizarPerfil
};

export default authService;