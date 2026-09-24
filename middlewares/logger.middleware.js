// middlewares/logger.middleware.js
// Módulo 6 — Persistencia en archivos planos.
// Registra cada visita a una ruta en logs/log.txt usando fs.appendFile(),
// con la estructura mínima que pide la consigna: fecha, hora y ruta accedida.

const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, '..', 'logs', 'log.txt');

function requestLogger(req, res, next) {
  const now = new Date();
  const fecha = now.toISOString().slice(0, 10);
  const hora = now.toISOString().slice(11, 19);
  const linea = `[${fecha} ${hora}] ${req.method} ${req.originalUrl}\n`;

  fs.appendFile(LOG_FILE, linea, (err) => {
    if (err) {
      // Si falla el logging no debe romper la petición del usuario,
      // solo lo avisamos por consola.
      console.error('No se pudo escribir en logs/log.txt:', err.message);
    }
  });

  next();
}

module.exports = requestLogger;
