import axios from 'axios';

const API_URL = '/api/herramientas/';

// Crear nueva herramienta
const crearHerramienta = async (herramientaData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.post(API_URL, herramientaData, config);
    return response.data;
};

// Obtener herramientas del usuario
const obtenerHerramientas = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.get(API_URL, config);
    return response.data;
};

// Borrar herramienta
const borrarHerramienta = async (herramientaId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.delete(API_URL + herramientaId, config);
    return response.data;
};

const herramientasService = {
    crearHerramienta,
    obtenerHerramientas,
    borrarHerramienta
};

export default herramientasService;