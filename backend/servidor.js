const express = require('express');
const {errorHandler} = require('./middleware/errorMiddleware');
const dotenv = require('dotenv').config();
const dbConexion = require('./conexion/dbConexion');
// ✅ 1. Importamos 'path' para manejar rutas de carpetas
const path = require('path'); 
const puerto = process.env.PORT || 8000;
const app = express();
const cors = require('cors');

dbConexion();

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());

// ✅ 2. HACER PÚBLICA LA CARPETA DE IMÁGENES
// Esto significa: "Cuando alguien pida la ruta /uploads, busca el archivo en la carpeta 'uploads' del servidor"
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ... Rutas de la API ...
app.use('/api/tareas', require('./rutas/rutasTareas'));
app.use('/api/usuarios', require('./rutas/rutasUsuarios'));
app.use('/api/herramientas', require('./rutas/rutasHerramientas'));
app.use('/api/rentas', require('./rutas/rutasRentas'));

app.get('/', (req, res) => {
    res.redirect('/api/tareas')
});

app.use(errorHandler);

app.listen(puerto, () => {
  console.log(`Servidor escuchando en http://penrose512.jcarlos19.com:${puerto}`);
});