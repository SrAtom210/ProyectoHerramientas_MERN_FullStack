const asyncHandler = require('express-async-handler'); // Si no tienes esta librería, usa try-catch estándar
const Herramienta = require('../modelos/Herramienta');

// @desc    Obtener todas las herramientas
// @route   GET /api/herramientas
// @access  Publico
const getHerramientas = async (req, res) => {
    try {
        const herramientas = await Herramienta.find();
        res.status(200).json(herramientas);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
}

// @desc    Crear nueva herramienta
// @route   POST /api/herramientas
// @access  Privado (luego lo protegeremos con JWT)
const crearHerramienta = async (req, res) => {
    // 1. Revisar si vienen los datos
    if (!req.body.nombre || !req.body.precio) {
        res.status(400);
        throw new Error('Por favor agrega nombre y precio');
    }

    try {
        // 2. Crear la herramienta
        const herramienta = await Herramienta.create({
            nombre: req.body.nombre,
            descripcion: req.body.descripcion,
            precio: req.body.precio,
            foto: req.body.foto,
            estado: req.body.estado
        });

        // 3. Responder con el dato creado
        res.status(201).json(herramienta);
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
}

module.exports = {
    getHerramientas,
    crearHerramienta
}