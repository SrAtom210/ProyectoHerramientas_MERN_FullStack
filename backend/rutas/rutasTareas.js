const express = require('express');
const router = express.Router();
const { proteger } = require('../middleware/authMiddleware');
const {obtenerTareas, crearTareas, actualizarTareas, eliminarTareas} = require('../controladores/controladorTareas');


/*
router.get('/', (req,res) => {
    res.status(200).json({mensaje: 'Obtener todas las tareas Rutas Tareas'});
});
*/

/*
router.post('/', (req, res) => {
    res.status(200).json({mensaje: 'Crear Tarea'});
});
*/

/*
router.put('/:id', (req, res) => {
    res.status(200).json({mensaje: `Tarea ${req.params.id} actualizada.`});
});
*/

/*
router.delete('/:id', (req, res) => {
    res.status(200).json({mensaje: `Tarea ${req.params.id} eliminada.`});
});
*/

router.get('/', proteger, obtenerTareas);
router.post('/', proteger, crearTareas);
router.put('/:id', proteger, actualizarTareas);
router.delete('/:id', proteger, eliminarTareas);

module.exports = router;