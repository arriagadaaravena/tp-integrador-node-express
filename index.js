// index.js

require('dotenv').config();
const express = require('express');
const path = require('path');

const requestLogger = require('./middlewares/logger.middleware');
const errorHandler = require('./middlewares/errorHandler.middleware');
const statusRoutes = require('./routes/status.routes');
const usuariosRoutes = require('./routes/usuarios.routes');
const usuariosOrmRoutes = require('./routes/usuariosOrm.routes');
const pedidosRoutes = require('./routes/pedidos.routes');
const { verificarConexion } = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

// ---------- Middlewares globales ----------
app.use(express.json());
app.use(requestLogger); // registra cada request en logs/log.txt (fs.appendFile)

// Ruta pública "/": sirve contenido estático desde /public (responde en HTML)
app.use(express.static(path.join(__dirname, 'public')));

// Ruta pública "/status": responde en JSON
app.use('/status', statusRoutes);

// Módulo 7: rutas de acceso a datos (SQL manual vs. ORM)
app.use('/usuarios', usuariosRoutes);
app.use('/usuarios-orm', usuariosOrmRoutes);
app.use('/pedidos', pedidosRoutes);

// ---------- Manejo de errores (siempre al final) ----------
app.use(errorHandler);

app.listen(PORT, async () => {
  console.log('Servidor iniciado');
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
  await verificarConexion();
});

module.exports = app;
