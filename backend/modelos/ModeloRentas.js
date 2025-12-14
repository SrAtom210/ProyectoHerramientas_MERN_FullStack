const mongoose = require('mongoose');

const rentaSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Usuario' // Conecta con tu colección de Usuarios
    },
    herramienta: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Herramienta' // Conecta con tu colección de Herramientas
    },
    fechaInicio: {
        type: Date,
        default: Date.now // Se pone la fecha de hoy automáticamente
    },
    fechaFin: {
        type: Date,
        // Opcional: Podrías calcularla después o pedirla al usuario
    },
    estado: {
        type: String,
        enum: ['activa', 'devuelta', 'retrasada'],
        default: 'activa'
    }
}, {
    timestamps: true // Crea createdAt y updatedAt
});

module.exports = mongoose.model('Renta', rentaSchema);