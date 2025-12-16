import axios from 'axios';

// ✅ Usamos tu dominio para que funcione en red/producción
const API_URL = 'http://penrose512.jcarlos19.com:8000/api/rentas/';

// Crear una nueva renta
const crearRenta = async (rentaData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL, rentaData, config);
  return response.data;
};

// Obtener mis rentas (Lo que yo renté)
// ✅ CORRECCIÓN: Agregamos 'mis-rentas' a la URL
const obtenerMisRentas = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL + 'mis-rentas', config);
  return response.data;
};

// Obtener mis clientes (Quien me ha rentado a mí)
// ✅ FALTABA ESTA FUNCIÓN
const obtenerClientes = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL + 'mis-clientes', config);
  return response.data;
};

// Cancelar / Devolver una renta
// ✅ FALTABA ESTA FUNCIÓN
const cancelarRenta = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.delete(API_URL + id, config);
  return response.data;
};

// Obtener recomendaciones (NUEVO)
// ✅ PARA EL DASHBOARD
const obtenerRecomendaciones = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL + 'recomendaciones', config);
  return response.data;
};

const rentaService = {
  crearRenta,
  obtenerMisRentas,
  obtenerClientes,      // Nuevo
  cancelarRenta,        // Nuevo
  obtenerRecomendaciones // Nuevo
};

export default rentaService;