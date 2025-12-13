import axios from 'axios';

// Asegúrate de que tenga la barra al final
const API_URL = '/api/usuarios/';

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

const authService = {
    registro,
    login,
    logout
};

export default authService;