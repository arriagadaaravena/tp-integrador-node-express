// middlewares/errorHandler.middleware.js
// Middleware centralizado de manejo de errores. Se coloca al final de todas
// las rutas en index.js. Devuelve siempre la misma forma de respuesta
// { status, message, data } que pide la consigna para las respuestas de la API.

function errorHandler(err, req, res, next) {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Error interno del servidor',
    data: null,
  });
}

module.exports = errorHandler;
