import axios from 'axios';

const API_URL = 'http://localhost:8000/api/rentas/';

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

// Obtener mis rentas
const getMisRentas = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL, config);
  return response.data;
};

const rentaService = {
  crearRenta,
  getMisRentas,
};

export default rentaService;