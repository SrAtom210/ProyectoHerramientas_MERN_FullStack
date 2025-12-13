const mongoose = require('mongoose')

const usuarioSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'Por favor teclea un nombre']
    },
    email: {
        type: String,
        required: [true, 'Por favor teclea un email'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Por favor teclea un password']
    },
    esAdmin: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true // Esto crea automáticamente campos createdAt y updatedAt
})

module.exports = mongoose.model('Usuario', usuarioSchema)