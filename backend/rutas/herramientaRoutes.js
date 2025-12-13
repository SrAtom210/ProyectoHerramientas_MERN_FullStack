const express = require('express');
const router = express.Router();
const { getHerramientas, crearHerramienta } = require('../controladores/herramientaController');

// Definimos la ruta raíz '/' que se concatenará en el servidor
// Si es GET -> getHerramientas
// Si es POST -> crearHerramienta
router.route('/').get(getHerramientas).post(crearHerramienta);

module.exports = router;