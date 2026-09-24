// index.js
// Archivo principal del proyecto (se ejecuta con "node index.js" o "npm start").
// Módulo 6: servidor Express, contenido estático, ruta /status y logging en archivo plano.
// Módulo 7: conexión a MySQL y rutas de acceso a datos (SQL manual y ORM).
// Módulo 8: API RESTful con autenticación JWT, subida de archivos y documentación Swagger.

require('dotenv').config();
const express = require('express');
const path = require('path');
const swaggerUi = require('swagger-ui-express');

const requestLogger = require('./middlewares/logger.middleware');
const errorHandler = require('./middlewares/errorHandler.middleware');
const statusRoutes = require('./routes/status.routes');
const usuariosRoutes = require('./routes/usuarios.routes');
const usuariosOrmRoutes = require('./routes/usuariosOrm.routes');
const pedidosRoutes = require('./routes/pedidos.routes');
const authRoutes = require('./routes/auth.routes');
const productosRoutes = require('./routes/productos.routes');
const uploadRoutes = require('./routes/upload.routes');
const openapi = require('./docs/openapi.json');
const { verificarConexion } = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

// Sin JWT_SECRET no se pueden firmar ni verificar tokens: mejor avisar al
// arrancar que fallar recién cuando alguien intente hacer login.
if (!process.env.JWT_SECRET) {
  console.warn('ADVERTENCIA: falta JWT_SECRET en el archivo .env (revisa .env.example)');
}

// ---------- Middlewares globales ----------
app.use(express.json());
app.use(requestLogger); // registra cada request en logs/log.txt (fs.appendFile)

// Ruta pública "/": sirve contenido estático desde /public (responde en HTML)
app.use(express.static(path.join(__dirname, 'public')));

// Módulo 8: archivos subidos con POST /upload, accesibles en /uploads/<archivo>
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Módulo 8: documentación interactiva de la API
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapi));

// Ruta pública "/status": responde en JSON
app.use('/status', statusRoutes);

// Módulo 7: rutas de acceso a datos (SQL manual vs. ORM)
app.use('/usuarios', usuariosRoutes);
app.use('/usuarios-orm', usuariosOrmRoutes);
app.use('/pedidos', pedidosRoutes);

// Módulo 8: autenticación, productos y subida de archivos
app.use('/', authRoutes); // POST /registro, POST /login, GET /perfil
app.use('/productos', productosRoutes);
app.use('/upload', uploadRoutes);

// Módulo 8: cualquier ruta que no exista responde en JSON (antes Express
// devolvía una página HTML "Cannot GET ...", poco útil para un cliente de API)
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: `No existe la ruta ${req.method} ${req.originalUrl}`,
    data: null,
  });
});

// ---------- Manejo de errores (siempre al final) ----------
app.use(errorHandler);

app.listen(PORT, async () => {
  console.log('Servidor iniciado');
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
  console.log(`Documentación de la API en http://localhost:${PORT}/api-docs`);
  await verificarConexion();
});

module.exports = app;
