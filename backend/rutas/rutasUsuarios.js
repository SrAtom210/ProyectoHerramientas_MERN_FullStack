const express = require('express');
const router = express.Router();
const {registroUsuario, loginUsuario, obtenerUsuarioActual} = require('../controladores/controladorUsuarios');
const { proteger } = require('../middleware/authMiddleware');

router.post('/', registroUsuario);
router.post('/login', loginUsuario);
router.get('/actual', proteger, obtenerUsuarioActual);


module.exports = router;