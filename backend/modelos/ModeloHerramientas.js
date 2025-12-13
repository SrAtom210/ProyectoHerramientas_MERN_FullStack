const mongoose = require('mongoose');

const herramientaSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Usuario' // Relación con tu modelo de Usuarios
    },
    nombre: {
        type: String,
        required: [true, 'Por favor teclea el nombre de la herramienta']
    },
    marca: {
        type: String,
        required: [true, 'Por favor indica la marca']
    },
    precio: {
        type: Number,
        required: [true, 'Por favor indica el precio de renta por día']
    },
    disponible: {
        type: Boolean,
        default: true
    },
    descripcion: {
        type: String,
        default: ''
    }
}, {
    timestamps: true // Crea campos createdAt y updatedAt automáticamente
});

module.exports = mongoose.model('Herramienta', herramientaSchema);