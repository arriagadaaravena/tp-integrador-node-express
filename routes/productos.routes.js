// routes/productos.routes.js
// Módulo 8 — Recurso REST /productos.
// Lectura pública; crear, modificar y eliminar requieren token.

const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productos.controller');
const verificarToken = require('../middlewares/auth.middleware');
const validarCampos = require('../middlewares/validarCampos.middleware');

router.get('/', productosController.listar);
router.get('/:id', productosController.obtener);
router.post('/', verificarToken, validarCampos(['nombre', 'precio'], ['precio']), productosController.crear);
router.put('/:id', verificarToken, validarCampos([], ['precio']), productosController.actualizar);
router.delete('/:id', verificarToken, productosController.eliminar);

module.exports = router;
