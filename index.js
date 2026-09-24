// index.js
// Módulo 6 — Primeros pasos con Node y Express.
// Archivo principal del proyecto (se ejecuta con "node index.js").
// Por ahora este servidor NO usa base de datos ni autenticación: eso se
// agrega en los Módulos 7 y 8. Acá el foco es: arrancar Express, servir
// contenido estático, exponer una ruta JSON y dejar registro de cada
// petición en un archivo plano.

require('dotenv').config();
const express = require('express');
const path = require('path');

const requestLogger = require('./middlewares/logger.middleware');
const errorHandler = require('./middlewares/errorHandler.middleware');
const statusRoutes = require('./routes/status.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// ---------- Middlewares globales ----------
app.use(express.json());
app.use(requestLogger); // registra cada request en logs/log.txt (fs.appendFile)

// Ruta pública "/": sirve contenido estático desde /public (responde en HTML)
app.use(express.static(path.join(__dirname, 'public')));

// Ruta pública "/status": responde en JSON
app.use('/status', statusRoutes);

// ---------- Manejo de errores (siempre al final) ----------
app.use(errorHandler);

app.listen(PORT, () => {
  console.log('Servidor iniciado');
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

module.exports = app;
