const express = require('express');
const router = express.Router();
const { 
    crearRenta, 
    obtenerMisRentas, 
    cancelarRenta, 
    obtenerClientes, 
    obtenerRecomendaciones // ✅ Importar
} = require('../controladores/controladorRentas');

const { proteger } = require('../middleware/authMiddleware');

router.post('/', proteger, crearRenta);
router.get('/mis-rentas', proteger, obtenerMisRentas); // Lo que yo debo
router.get('/mis-clientes', proteger, obtenerClientes); // ✅ Lo que me deben (NUEVA)
router.delete('/:id', proteger, cancelarRenta);
router.get('/recomendaciones', proteger, obtenerRecomendaciones); // ✅ Nueva ruta

module.exports = router;