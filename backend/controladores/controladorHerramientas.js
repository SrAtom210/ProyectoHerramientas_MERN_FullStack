const asyncHandler = require('express-async-handler');
const Herramienta = require('../modelos/ModeloHerramientas');
const Renta = require('../modelos/ModeloRentas');

// @desc    Obtener TODAS las herramientas (Para el Catálogo Global)
// @route   GET /api/herramientas
// @access  Privado (o Público, depende de tu lógica)
const obtenerHerramientas = asyncHandler(async (req, res) => {
    // 1. Traemos todas las herramientas
    const herramientas = await Herramienta.find().populate('user', 'nombre email');

    // 2. Traemos todas las rentas que estén activas hoy
    // (Una renta está activa si no tiene fechaFin o si fechaFin es mayor a hoy)
    const hoy = new Date();
    
    const rentasActivas = await Renta.find({
        fechaFin: { $gte: hoy } // $gte significa "Greater Than or Equal" (Mayor o igual a hoy)
    });

    // Creamos un Set con los IDs de las herramientas ocupadas para búsqueda rápida
    const herramientasOcupadasIds = new Set(rentasActivas.map(r => r.herramienta.toString()));

    // 3. Convertimos las herramientas a objetos planos y agregamos la bandera "rentada"
    const herramientasConEstado = herramientas.map(herramienta => {
        const h = herramienta.toObject(); // Convertir a objeto JS normal para poder agregarle propiedades
        
        // Si el ID de esta herramienta está en la lista de ocupadas, está rentada
        h.rentada = herramientasOcupadasIds.has(h._id.toString());
        
        return h;
    });
    
    res.status(200).json(herramientasConEstado);
});

// @desc    Crear herramienta
// @route   POST /api/herramientas
// @access  Privado
const crearHerramienta = asyncHandler(async (req, res) => {
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
        // Guardamos la ruta normalizada
        imagen: req.file.path.replace(/\\/g, "/") 
    });

    res.status(200).json(herramienta);
});

// @desc    Actualizar herramienta
// @route   PUT /api/herramientas/:id
// @access  Privado
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

    let datosActualizar = req.body;
    
    if (req.file) {
        datosActualizar.imagen = req.file.path.replace(/\\/g, "/");
    }

    const herramientaActualizada = await Herramienta.findByIdAndUpdate(req.params.id, datosActualizar, {
        new: true,
    });

    res.status(200).json(herramientaActualizada);
});

// @desc    Borrar herramienta
// @route   DELETE /api/herramientas/:id
// @access  Privado
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