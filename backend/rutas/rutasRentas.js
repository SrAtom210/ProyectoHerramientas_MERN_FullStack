const express = require('express');
const router = express.Router();
const { crearRenta, obtenerMisRentas } = require('../controladores/controladorRentas');
const { proteger } = require('../middleware/authMiddleware');

// Todas las rutas son privadas, así que usamos 'proteger'
router.post('/', proteger, crearRenta);
router.get('/mis-rentas', proteger, obtenerMisRentas);

module.exports = router;