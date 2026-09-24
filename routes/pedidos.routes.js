// routes/pedidos.routes.js
const express = require('express');
const router = express.Router();
const pedidosController = require('../controllers/pedidos.controller');

router.get('/', pedidosController.listarPedidos);
router.post('/', pedidosController.crearPedido);
router.put('/:id', pedidosController.actualizarPedido);
router.delete('/:id', pedidosController.eliminarPedido);

module.exports = router;
