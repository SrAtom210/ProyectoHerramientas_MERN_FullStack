const express = require('express');
const router = express.Router();
const { obtenerHerramientas, crearHerramienta, actualizarHerramienta, borrarHerramienta } = require('../controladores/controladorHerramientas');
const { proteger } = require('../middleware/authMiddleware');

// Todas las rutas protegidas
router.route('/').get(proteger, obtenerHerramientas).post(proteger, crearHerramienta);
router.route('/:id').delete(proteger, borrarHerramienta).put(proteger, actualizarHerramienta);

module.exports = router;