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

    // ✅ MEJORA 1: No permitir que el dueño rente su propia herramienta
    if (herramienta.user.toString() === req.usuario.id) {
        res.status(400);
        throw new Error('No puedes rentar tu propia herramienta');
    }

    // ✅ MEJORA 2: Verificar si la herramienta YA está rentada
    // Buscamos si existe alguna renta activa para esta herramienta (que termine hoy o en el futuro)
    const rentaExistente = await Renta.findOne({
        herramienta: herramientaId,
        fechaFin: { $gte: new Date() } // Si la fecha fin es mayor o igual a hoy
    });

    if (rentaExistente) {
        res.status(400);
        throw new Error('Esta herramienta ya no está disponible (alguien más la acaba de rentar).');
    }

    // 3. Crear la renta
    const renta = await Renta.create({
        user: req.usuario.id, // Dueño de la renta (el que paga)
        herramienta: herramientaId,
        fechaInicio: fechaInicio || Date.now(), 
        fechaFin: fechaFin,
        precioTotal: precioTotal || 0 
    });

    res.status(201).json(renta);
});

// @desc    Obtener mis rentas (Historial de lo que yo he rentado)
// @route   GET /api/rentas/mis-rentas
// @access  Privado
const obtenerMisRentas = asyncHandler(async (req, res) => {
    const rentas = await Renta.find({ user: req.usuario.id })
                              .populate('herramienta') // Trae la foto y nombre
                              .sort({ createdAt: -1 }); // Ordena por la más reciente

    res.status(200).json(rentas);
});

// @desc    Cancelar / Devolver renta
// @route   DELETE /api/rentas/:id
// @access  Privado
const cancelarRenta = asyncHandler(async (req, res) => {
    const renta = await Renta.findById(req.params.id);

    if (!renta) {
        res.status(404);
        throw new Error('Renta no encontrada');
    }

    // Verificar que el usuario sea el dueño de la renta
    if (renta.user.toString() !== req.usuario.id) {
        res.status(401);
        throw new Error('Acceso no autorizado');
    }

    await renta.deleteOne();

    res.status(200).json({ id: req.params.id });
});

// @desc    Obtener rentas de MIS herramientas (Mis Clientes / Ventas)
// @route   GET /api/rentas/mis-clientes
// @access  Privado
const obtenerClientes = asyncHandler(async (req, res) => {
    // 1. Encontramos mis herramientas
    const misHerramientas = await Herramienta.find({ user: req.usuario.id });
    const misHerramientasIds = misHerramientas.map(h => h._id);

    // 2. Buscamos rentas asociadas a esas herramientas
    const clientes = await Renta.find({ herramienta: { $in: misHerramientasIds } })
                              .populate('user', 'nombre email')
                              .populate('herramienta')
                              .sort({ createdAt: -1 });

    res.status(200).json(clientes);
});

// @desc    Obtener recomendaciones basadas en historial
// @route   GET /api/rentas/recomendaciones
// @access  Privado
const obtenerRecomendaciones = asyncHandler(async (req, res) => {
    // 1. Buscamos la última renta del usuario
    const ultimaRenta = await Renta.findOne({ user: req.usuario.id })
                                   .sort({ createdAt: -1 })
                                   .populate('herramienta');

    let recomendaciones = [];

    if (ultimaRenta && ultimaRenta.herramienta) {
        // Caso 1: Tiene historial. Buscamos similares.
        const palabraClave = ultimaRenta.herramienta.nombre.split(' ')[0]; 

        recomendaciones = await Herramienta.find({
            $and: [
                { _id: { $ne: ultimaRenta.herramienta._id } }, 
                { user: { $ne: req.usuario.id } },
                {
                    $or: [
                        { marca: ultimaRenta.herramienta.marca },
                        { nombre: { $regex: palabraClave, $options: 'i' } }
                    ]
                }
            ]
        })
        .limit(3)
        // ✅ CORRECCIÓN 1: Agregamos populate aquí
        .populate('user', 'nombre email'); 

    } else {
        // Caso 2: Usuario nuevo. Mostramos aleatorias/recientes.
        recomendaciones = await Herramienta.find({ user: { $ne: req.usuario.id } })
            .limit(3)
            // ✅ CORRECCIÓN 2: Y agregamos populate también aquí
            .populate('user', 'nombre email');
    }

    res.status(200).json(recomendaciones);
});

module.exports = {
    crearRenta,
    obtenerMisRentas,
    cancelarRenta,
    obtenerClientes,
    obtenerRecomendaciones // ✅ Asegúrate de exportar esta nueva función
};