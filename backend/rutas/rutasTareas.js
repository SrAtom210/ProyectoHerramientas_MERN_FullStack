const express = require('express');
const router = express.Router();

// Ruta dummy para que no falle el servidor
router.get('/', (req, res) => {
    res.json({ mensaje: 'Ruta de tareas funcionando' });
});

module.exports = router; // <--- ESTO ES LO QUE TE FALTABA