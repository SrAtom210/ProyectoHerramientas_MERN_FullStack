const asyncHandler = require('express-async-handler');
const Renta = require('../modelos/ModeloRentas');
const Herramienta = require('../modelos/ModeloHerramientas'); // Asegúrate que este nombre sea correcto según tu archivo

// @desc    Crear una nueva renta
// @route   POST /api/rentas
// @access  Privado
const crearRenta = asyncHandler(async (req, res) => {
    const { herramientaId } = req.body;

    // 1. Verificar que la herramienta existe
    const herramienta = await Herramienta.findById(herramientaId);

    if (!herramienta) {
        res.status(404);
        throw new Error('Herramienta no encontrada');
    }

    // 2. Crear la renta vinculando al usuario logueado (req.usuario.id)
    const renta = await Renta.create({
        user: req.usuario.id, // Viene del token (middleware proteger)
        herramienta: herramientaId,
        fechaFin: req.body.fechaFin || null // Opcional por ahora
    });

    res.status(201).json(renta);
});

// @desc    Obtener mis rentas
// @route   GET /api/rentas/mis-rentas
// @access  Privado
const obtenerMisRentas = asyncHandler(async (req, res) => {
    // Busca rentas donde el usuario sea el que está logueado
    // .populate('herramienta') es MAGIA: sustituye el ID raro por los datos reales (nombre, precio)
    const rentas = await Renta.find({ user: req.usuario.id })
                              .populate('herramienta', 'nombre precio marca'); 

    res.status(200).json(rentas);
});

module.exports = {
    crearRenta,
    obtenerMisRentas
};