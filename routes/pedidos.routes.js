// routes/pedidos.routes.js
// Lectura pública; crear, modificar y eliminar requieren token (Módulo 8).

const express = require('express');
const router = express.Router();
const pedidosController = require('../controllers/pedidos.controller');
const verificarToken = require('../middlewares/auth.middleware');
const validarCampos = require('../middlewares/validarCampos.middleware');

router.get('/', pedidosController.listarPedidos);
router.post('/', verificarToken, validarCampos(['usuarioId', 'producto', 'monto'], ['usuarioId', 'monto']), pedidosController.crearPedido);
router.put('/:id', verificarToken, validarCampos([], ['monto']), pedidosController.actualizarPedido);
router.delete('/:id', verificarToken, pedidosController.eliminarPedido);

// Módulo 8: relación N:M Pedido <-> Producto
router.get('/:id/productos', pedidosController.listarProductosDePedido);
router.post('/:id/productos', verificarToken, validarCampos(['productoId'], ['productoId', 'cantidad']), pedidosController.agregarProductoAPedido);

module.exports = router;
