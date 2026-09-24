// routes/upload.routes.js
// Módulo 8 — POST /upload (protegida).
// Orden de los middlewares: primero se valida el token (así multer sabe a
// qué usuario pertenece el archivo), después multer procesa y valida la
// imagen, y recién ahí llega al controlador.

const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/upload.controller');
const verificarToken = require('../middlewares/auth.middleware');
const { subirImagen } = require('../middlewares/upload.middleware');

router.post('/', verificarToken, subirImagen('archivo'), uploadController.subirFoto);

module.exports = router;
