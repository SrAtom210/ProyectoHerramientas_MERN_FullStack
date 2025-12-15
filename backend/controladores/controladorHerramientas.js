const asyncHandler = require('express-async-handler');
const Herramienta = require('../modelos/ModeloHerramientas');

// @desc    Obtener herramientas (Leer)
// @route   GET /api/herramientas
// @access  Privado
const obtenerHerramientas = asyncHandler(async (req, res) => {
    // Solo mostramos las herramientas del usuario logueado
    const herramientas = await Herramienta.find({ user: req.usuario.id });
    res.status(200).json(herramientas);
});

// @desc    Crear herramienta (Crear)
// @route   POST /api/herramientas
// @access  Privado
const crearHerramienta = asyncHandler(async (req, res) => {
    // ✅ 1. VALIDACIÓN DE IMAGEN
    // Multer pone el archivo en req.file. Si no está, es que no se subió nada.
    if (!req.file) {
        res.status(400);
        throw new Error('Por favor sube una imagen de la herramienta');
    }

    if (!req.body.nombre || !req.body.precio) {
        res.status(400);
        throw new Error('Por favor añade nombre y precio');
    }

    const herramienta = await Herramienta.create({
        nombre: req.body.nombre,
        marca: req.body.marca,
        precio: req.body.precio,
        descripcion: req.body.descripcion,
        user: req.usuario.id,
        // ✅ 2. GUARDAR LA RUTA DE LA IMAGEN
        // req.file.path contiene algo como "uploads\imagen-123.jpg"
        // Lo normalizamos a "uploads/imagen-123.jpg" para que funcione en web.
        imagen: req.file.path.replace(/\\/g, "/") 
    });

    res.status(200).json(herramienta);
});

// @desc    Actualizar herramienta
// @route   PUT /api/herramientas/:id
// @access  Privado
const actualizarHerramienta = asyncHandler(async (req, res) => {
    const herramienta = await Herramienta.findById(req.params.id);

    if (!herramienta) {
        res.status(400);
        throw new Error('Herramienta no encontrada');
    }

    // Verificar que el usuario sea el dueño
    if (herramienta.user.toString() !== req.usuario.id) {
        res.status(401);
        throw new Error('Acceso no autorizado');
    }

    // ✅ OPCIONAL: Lógica por si quieres permitir actualizar la imagen
    let datosActualizar = req.body;
    
    // Si en el PUT viene una nueva imagen, actualizamos la ruta
    if (req.file) {
        datosActualizar.imagen = req.file.path.replace(/\\/g, "/");
    }

    const herramientaActualizada = await Herramienta.findByIdAndUpdate(req.params.id, datosActualizar, {
        new: true,
    });

    res.status(200).json(herramientaActualizada);
});

// @desc    Borrar herramienta
// @route   DELETE /api/herramientas/:id
// @access  Privado
const borrarHerramienta = asyncHandler(async (req, res) => {
    const herramienta = await Herramienta.findById(req.params.id);

    if (!herramienta) {
        res.status(400);
        throw new Error('Herramienta no encontrada');
    }

    // Verificar dueño
    if (herramienta.user.toString() !== req.usuario.id) {
        res.status(401);
        throw new Error('Acceso no autorizado');
    }

    await herramienta.deleteOne(); 

    res.status(200).json({ id: req.params.id });
});

module.exports = {
    obtenerHerramientas,
    crearHerramienta,
    actualizarHerramienta,
    borrarHerramienta
};