const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Usuario = require('../modelos/ModeloUsuarios');

const registroUsuario =asyncHandler(async (req, res) => {
    //res.json({ mensaje: 'Registro de usuario' });
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
        res.status(400);
        throw new Error('Por favor completa todos los campos');
    }

    const usuarioExistente = await Usuario.findOne({ email });

    if (usuarioExistente) {
        res.status(400);
        throw new Error('El usuario ya existe');
    }
    //res.json({ mensaje: 'Usuario registrado correctamente' });
    const sal = await bcrypt.genSalt(10);
    const PasswordEncriptado = await bcrypt.hash(password, sal);
    const usuario = await Usuario.create({
        nombre,
        email,
        password: PasswordEncriptado,
    });

    if (!usuario) {
        res.status(400);
        throw new Error('Datos de usuario no válidos');
    } else {
        res.status(201).json({
            _id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email, token: generarTokenJWT(usuario._id)   
        });
    }
});


const loginUsuario =asyncHandler(async (req, res) => {
    //res.json({ mensaje: 'Usuario Loggeado Correctamente' });

    if (!req.body) {
        res.status(400);
        throw new Error('Por favor completa todos los campos');
    }
    
    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ email });

    if (usuario && (await bcrypt.compare(password, usuario.password))) {
       res.json({
        _id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email, token: generarTokenJWT(usuario._id)
       });
    } else {
        res.status(401);
        throw new Error('Datos Inválidos');
    } 
});

const obtenerUsuarioActual =asyncHandler(async (req, res) => {
    //res.json({ mensaje: 'Datos del usuario actual' });
    const {_id, nombre, email } = await Usuario.findById(req.usuario.id);
    res.status(200).json({id: _id, nombre, email});
});

const generarTokenJWT = id => jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '5d',
});

// @desc    Actualizar perfil de usuario
// @route   PUT /api/usuarios/perfil
// @access  Privado
const actualizarPerfil = asyncHandler(async (req, res) => {
    const usuario = await Usuario.findById(req.usuario.id);

    if (!usuario) {
        res.status(404);
        throw new Error('Usuario no encontrado');
    }

    // 1. Actualizar Nombre
    if (req.body.nombre) {
        usuario.nombre = req.body.nombre;
    }

    // 2. Actualizar Contraseña (si se envía)
    if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(req.body.password, salt);
    }

    // Guardamos en la BD
    const usuarioActualizado = await usuario.save();

    // Devolvemos los datos nuevos (incluyendo el token viejo para no desloguear)
    res.status(200).json({
        _id: usuarioActualizado._id,
        nombre: usuarioActualizado.nombre,
        email: usuarioActualizado.email,
        token: req.headers.authorization.split(' ')[1] // Mantenemos el token actual
    });
});

module.exports = { registroUsuario, loginUsuario, obtenerUsuarioActual, actualizarPerfil};