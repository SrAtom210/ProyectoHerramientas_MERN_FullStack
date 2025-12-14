import axios from 'axios';

// BIEN:
const API_URL = 'http://penrose512.jcarlos19.com:8000/api/herramientas/';

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

// Actualizar herramienta
const actualizarHerramienta = async (id, herramientaData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    // Ojo: En PUT enviamos la URL con el ID + los datos nuevos
    const response = await axios.put(API_URL + id, herramientaData, config);
    return response.data;
};

const herramientasService = {
    crearHerramienta,
    obtenerHerramientas,
    actualizarHerramienta, // <--- No olvides exportarla
    borrarHerramienta
};

export default herramientasService;