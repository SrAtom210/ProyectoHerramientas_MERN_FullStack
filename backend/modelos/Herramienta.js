const mongoose = require('mongoose');

const herramientaSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre de la herramienta es obligatorio'],
        trim: true // Elimina espacios vacíos al inicio y final
    },
    descripcion: {
        type: String,
        required: [true, 'La descripción es necesaria para saber medidas o tipo'],
    },
    precio: {
        type: Number,
        required: [true, 'Debes asignar un precio de renta por día'],
        min: [0, 'El precio no puede ser negativo']
    },
    foto: {
        type: String,
        required: [true, 'La URL de la foto es obligatoria'],
        default: 'https://via.placeholder.com/150' // Imagen por defecto si fallara la carga
    },
    estado: {
        type: String,
        enum: ['disponible', 'rentada', 'mantenimiento'], // Solo permite estos 3 valores
        default: 'disponible'
    },
    // Opcional: Si quieres saber qué usuario la subió (si tienes roles de admin)
    // usuario: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User',
    //     required: true
    // }
}, {
    timestamps: true // Crea automáticamente campos 'createdAt' y 'updatedAt'
});

module.exports = mongoose.model('Herramienta', herramientaSchema);