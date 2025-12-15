const mongoose = require('mongoose');

const rentaSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Usuario'
    },
    herramienta: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Herramienta'
    },
    fechaInicio: {
        type: Date,
        required: true,
        default: Date.now
    },
    fechaFin: {
        type: Date
        // Se guarda la fecha de finalización enviada desde el frontend
    },
    // ✅ CAMPO FALTANTE AGREGADO:
    precioTotal: {
        type: Number,
        required: true,
        default: 0
    },
    estado: {
        type: String,
        enum: ['activa', 'devuelta', 'retrasada'],
        default: 'activa'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Renta', rentaSchema);