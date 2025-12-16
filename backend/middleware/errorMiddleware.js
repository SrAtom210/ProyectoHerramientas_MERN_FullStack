const errorHandler = (err, req, res, next) => {
    const codigoEstado = res.statusCode ? res.statusCode : 500;
    res.status(codigoEstado);
    
    // ✅ CAMBIO CLAVE: Usamos 'message' en lugar de 'mensaje'
    res.json({
        message: err.message, 
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
};

module.exports = { errorHandler };