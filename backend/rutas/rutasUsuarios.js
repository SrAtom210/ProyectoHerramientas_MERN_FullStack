const express = require('express');
const router = express.Router();
const {registroUsuario, loginUsuario, obtenerUsuarioActual, actualizarPerfil} = require('../controladores/controladorUsuarios');
const { proteger } = require('../middleware/authMiddleware');

router.post('/', registroUsuario);
router.post('/login', loginUsuario);
router.get('/actual', proteger, obtenerUsuarioActual);
router.put('/perfil', proteger, actualizarPerfil);

module.exports = router;