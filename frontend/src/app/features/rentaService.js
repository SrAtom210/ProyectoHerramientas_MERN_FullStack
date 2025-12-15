import axios from 'axios';

// Asegúrate que esta URL coincida con tu backend (puerto 8000)
const API_URL = 'http://penrose512.jcarlos19.com:8000/api/rentas/';

// Crear una renta
const crearRenta = async (rentaData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL, rentaData, config);
  return response.data;
};

// Obtener mis rentas
const obtenerMisRentas = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL + 'mis-rentas', config);
  return response.data;
};

// ✅ NUEVO: Función para Devolver / Cancelar renta
const cancelarRenta = async (rentaId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // Petición DELETE a: http://.../api/rentas/:id
  const response = await axios.delete(API_URL + rentaId, config);
  return response.data;
};

const obtenerClientes = async (token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.get(API_URL + 'mis-clientes', config);
  return response.data;
};

const rentaService = {
  crearRenta,
  obtenerMisRentas,
  cancelarRenta,
  obtenerClientes, // ✅ Exportar
};

export default rentaService;