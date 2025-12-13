const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const Usuario = require('../modelos/Usuario')

// @desc    Registrar un nuevo usuario
// @route   POST /api/usuarios
// @access  Publico
const registrarUsuario = asyncHandler(async (req, res) => {
    const { nombre, email, password } = req.body

    if (!nombre || !email || !password) {
        res.status(400)
        throw new Error('Por favor rellena todos los campos')
    }

    // Verificar si el usuario ya existe
    const usuarioExiste = await Usuario.findOne({ email })

    if (usuarioExiste) {
        res.status(400)
        throw new Error('Ese usuario ya existe')
    }

    // Hash password (Encriptar)
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Crear usuario
    const usuario = await Usuario.create({
        nombre,
        email,
        password: hashedPassword
    })

    if (usuario) {
        res.status(201).json({
            _id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarToken(usuario.id)
        })
    } else {
        res.status(400)
        throw new Error('Datos de usuario no validos')
    }
})

// @desc    Autenticar usuario (Login)
// @route   POST /api/usuarios/login
// @access  Publico
const loginUsuario = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    // Verificar email
    const usuario = await Usuario.findOne({ email })

    // Verificar password (compara la que escribió con la encriptada)
    if (usuario && (await bcrypt.compare(password, usuario.password))) {
        res.json({
            _id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarToken(usuario.id)
        })
    } else {
        res.status(400)
        throw new Error('Credenciales incorrectas')
    }
})

// @desc    Obtener datos del usuario
// @route   GET /api/usuarios/me
// @access  Privado
const getMe = asyncHandler(async (req, res) => {
    // req.usuario ya viene listo desde el middleware authMiddleware
    res.status(200).json(req.usuario)
})

// Generar JWT (El Token)
const generarToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d', // El token dura 30 días
    })
}

module.exports = {
    registrarUsuario,
    loginUsuario,
    getMe,
}