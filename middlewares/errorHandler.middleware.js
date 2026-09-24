// middlewares/errorHandler.middleware.js
// Middleware centralizado de manejo de errores. Se coloca al final de todas
// las rutas en index.js. Devuelve siempre la misma forma de respuesta
// { status, message, data } que pide la consigna para las respuestas de la API.
//
// Módulo 8: si el error trae un statusCode (por ejemplo 401 de login o 409
// de email repetido) se respeta ese código; solo los errores inesperados
// (500) se registran completos en la consola.

function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;

  if (statusCode >= 500) {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    status: 'error',
    message: statusCode >= 500 ? 'Error interno del servidor' : err.message,
    data: null,
  });
}

module.exports = errorHandler;
