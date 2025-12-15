const express = require('express');
const router = express.Router();
const { crearRenta, obtenerMisRentas, cancelarRenta } = require('../controladores/controladorRentas');
const { proteger } = require('../middleware/authMiddleware');

router.post('/', proteger, crearRenta);
router.get('/mis-rentas', proteger, obtenerMisRentas);

// ✅ Agrega esta línea para que funcione el botón "Devolver":
router.delete('/:id', proteger, cancelarRenta);

module.exports = router;