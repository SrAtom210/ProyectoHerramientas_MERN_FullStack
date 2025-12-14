const express = require('express');
const {errorHandler} = require('./middleware/errorMiddleware');
const dotenv = require('dotenv').config();
const dbConexion = require('./conexion/dbConexion');
const puerto = process.env.PORT || 8000;
const app = express();
const cors = require('cors');

dbConexion();


app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(cors());

// --- CÓDIGO CHISMOSO (Muestra todas las peticiones) ---
app.use((req, res, next) => {
    console.log(`📢 PETICIÓN RECIBIDA: [${req.method}] ${req.originalUrl}`);
    next();
});
// -----------------------------------------------------

//app.get('/api/tareas', (req, res) => {
//  res.status(200).json({mensaje: 'Obtener todas las tareas'});
//});

app.use('/api/tareas', require('./rutas/rutasTareas'));
app.use('/api/usuarios', require('./rutas/rutasUsuarios'));
app.use('/api/herramientas', require('./rutas/rutasHerramientas')); // <--- AGREGA ESTO
// ...

app.get('/', (req, res) => {
    res.redirect('/api/tareas')
});

app.use(errorHandler);

app.listen(puerto, () => {
  console.log(`Servidor escuchando en http://penrose512.jcarlos19.com:${puerto}`);
});
