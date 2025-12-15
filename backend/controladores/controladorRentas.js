const asyncHandler = require('express-async-handler');
const Renta = require('../modelos/ModeloRentas');
const Herramienta = require('../modelos/ModeloHerramientas');

// @desc    Crear una nueva renta
// @route   POST /api/rentas
// @access  Privado
const crearRenta = asyncHandler(async (req, res) => {
    // Extraemos los datos que envía el frontend
    const { herramientaId, fechaInicio, fechaFin, precioTotal } = req.body;

    // 1. Verificar que la herramienta existe
    const herramienta = await Herramienta.findById(herramientaId);

    if (!herramienta) {
        res.status(404);
        throw new Error('Herramienta no encontrada');
    }

    // 2. Crear la renta
    const renta = await Renta.create({
        user: req.usuario.id, // Dueño de la renta (el que paga)
        herramienta: herramientaId,
        // Si el frontend manda fechas, las usamos. Si no, default a ahora.
        fechaInicio: fechaInicio || Date.now(), 
        fechaFin: fechaFin || null,
        precioTotal: precioTotal || 0 
    });

    res.status(201).json(renta);
});

// @desc    Obtener mis rentas
// @route   GET /api/rentas/mis-rentas
// @access  Privado
const obtenerMisRentas = asyncHandler(async (req, res) => {
    // ✅ CORRECCIÓN IMPORTANTE:
    // Al poner solo .populate('herramienta'), le decimos a Mongo: 
    // "Tráeme TODOS los datos de la herramienta (imagen, nombre, precio, marca, etc.)"
    // Antes tenías una lista que excluía la imagen.
    const rentas = await Renta.find({ user: req.usuario.id })
                              .populate('herramienta'); 

    res.status(200).json(rentas);
});

// @desc    Cancelar / Devolver renta
// @route   DELETE /api/rentas/:id
// @access  Privado
const cancelarRenta = asyncHandler(async (req, res) => {
    // Buscamos la renta por el ID que viene en la URL
    const renta = await Renta.findById(req.params.id);

    if (!renta) {
        res.status(404);
        throw new Error('Renta no encontrada');
    }

    // Verificar que el usuario que quiere borrar sea el dueño de la renta
    if (renta.user.toString() !== req.usuario.id) {
        res.status(401);
        throw new Error('Acceso no autorizado');
    }

    // Borramos la renta (Devolución)
    await renta.deleteOne();

    res.status(200).json({ id: req.params.id });
});

// @desc    Obtener rentas de MIS herramientas (Gente que me rentó a mí)
// @route   GET /api/rentas/mis-clientes
// @access  Privado
const obtenerClientes = asyncHandler(async (req, res) => {
    // 1. Primero encontramos TODAS las herramientas que me pertenecen
    const misHerramientas = await Herramienta.find({ user: req.usuario.id });
    
    // 2. Extraemos solo los IDs de mis herramientas
    const misHerramientasIds = misHerramientas.map(h => h._id);

    // 3. Buscamos en la colección de Rentas aquellas donde la herramienta coincida con mis IDs
    const clientes = await Renta.find({ herramienta: { $in: misHerramientasIds } })
                              .populate('user', 'nombre email') // Traemos datos del CLIENTE (quien rentó)
                              .populate('herramienta');         // Traemos datos de la HERRAMIENTA

    res.status(200).json(clientes);
});

module.exports = {
    crearRenta,
    obtenerMisRentas,
    cancelarRenta,
    obtenerClientes // <--- ¡No olvides exportarla!
};