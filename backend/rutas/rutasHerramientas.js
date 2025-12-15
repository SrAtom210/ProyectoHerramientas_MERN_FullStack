const express = require('express');
const router = express.Router();
const { obtenerHerramientas, crearHerramienta, actualizarHerramienta, borrarHerramienta } = require('../controladores/controladorHerramientas');
const { proteger } = require('../middleware/authMiddleware');

// ✅ 1. Importaciones necesarias para subir archivos
const multer = require('multer');
const path = require('path');

// ✅ 2. Configurar el motor de almacenamiento de Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Indica la carpeta donde se guardarán los archivos.
        // IMPORTANTE: Debes crear esta carpeta manualmente en la raíz de 'backend'
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        // Genera un nombre único para el archivo: nombreCampo-fechaActual.extension
        // Ej: imagen-167888999123.jpg
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// ✅ 3. Inicializar el middleware de upload
// Puedes añadir filtros aquí para aceptar solo imágenes, pero por ahora lo dejaremos simple.
const upload = multer({ storage: storage });


// Todas las rutas protegidas
router.route('/')
    .get(proteger, obtenerHerramientas)
    // ✅ 4. Insertamos el middleware upload.single('imagen') ANTES del controlador
    // 'imagen' debe coincidir con el 'name' del input en el frontend.
    .post(proteger, upload.single('imagen'), crearHerramienta);

router.route('/:id')
    .delete(proteger, borrarHerramienta)
    // ✅ También lo agregamos en PUT por si en el futuro quieres permitir editar la imagen
    .put(proteger, upload.single('imagen'), actualizarHerramienta);

module.exports = router;