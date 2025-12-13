import axios from 'axios';

// La URL base de tu backend (Asegúrate que el puerto coincida)
const API_URL = 'http://localhost:8000/api/usuarios/';

// Registrar usuario
const register = async (userData) => {
  const response = await axios.post(API_URL, userData);

  if (response.data) {
    // Si el backend responde con datos (incluyendo el token), lo guardamos
    localStorage.setItem('user', JSON.stringify(response.data));
  }

  return response.data;
};

// Login usuario
const login = async (userData) => {
  const response = await axios.post(API_URL + 'login', userData);

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }

  return response.data;
};

// Logout usuario
const logout = () => {
  localStorage.removeItem('user');
};

const authService = {
  register,
  logout,
  login,
};

export default authService;