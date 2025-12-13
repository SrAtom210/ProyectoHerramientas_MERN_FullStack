const express = require('express');
const router = express.Router();
const { registrarUsuario, loginUsuario, getMe } = require('../controladores/usuarioController');
const { protect } = require('../middleware/authMiddleware');

// Registrar usuario
router.post('/', registrarUsuario);

// Login (Iniciar sesión)
router.post('/login', loginUsuario);

// Obtener mis datos (Ruta protegida)
router.get('/me', protect, getMe);

module.exports = router;