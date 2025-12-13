const jwt  = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const Usuario = require('../modelos/ModeloUsuarios');

const proteger = asyncHandler(async (req, resizeBy, next) =>{
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            token = req.headers.authorization.split(' ')[1];
            const decodificado = jwt.verify(token, process.env.JWT_SECRET);
            req.usuario = await Usuario.findById(decodificado.id).select('-password');
            next();
        } catch (error) {
            console.log(error);
            resizeBy.status(401);
            throw new Error('No esta autorizado')
        }
    }

    if (!token){
        resizeBy.status(401);
        throw new Error('No autorizado, no proporcionó token');
    }
});

module.exports = { proteger };