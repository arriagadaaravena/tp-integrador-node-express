// middlewares/auth.middleware.js
// Módulo 8 — Protección de rutas con JWT (Lección 4).
//
// El cliente debe enviar el token obtenido en POST /login en la cabecera:
//   Authorization: Bearer <token>
// Si falta, es inválido o expiró, se responde 401 y la petición NO llega
// al controlador.

const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const [tipo, token] = authHeader.split(' ');

  if (tipo !== 'Bearer' || !token) {
    return res.status(401).json({
      status: 'error',
      message: 'Acceso denegado: se requiere un token (Authorization: Bearer <token>)',
      data: null,
    });
  }

  try {
    // jwt.verify comprueba a la vez la firma (validez) y la fecha de
    // expiración ("exp") del token.
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = { id: payload.id, email: payload.email };
    next();
  } catch (error) {
    const message =
      error.name === 'TokenExpiredError'
        ? 'El token expiró, vuelve a iniciar sesión en POST /login'
        : 'Token inválido';

    return res.status(401).json({ status: 'error', message, data: null });
  }
}

module.exports = verificarToken;
