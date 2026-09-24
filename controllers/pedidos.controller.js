// controllers/pedidos.controller.js
// CRUD completo sobre "pedidos" (SQL manual), con el mismo formato de
// respuesta { status, message, data } usado en el resto de la API.

const pedidoService = require('../services/pedido.service');

// GET /pedidos  (opcionalmente ?usuarioId=)
async function listarPedidos(req, res, next) {
  try {
    const { usuarioId } = req.query;
    const pedidos = await pedidoService.getPedidos({ usuarioId });
    res.json({
      status: 'success',
      message: 'Pedidos obtenidos correctamente',
      data: pedidos,
    });
  } catch (error) {
    next(error);
  }
}

// POST /pedidos
async function crearPedido(req, res, next) {
  try {
    const { usuarioId, producto, monto } = req.body;

    if (!usuarioId || !producto || monto === undefined) {
      return res.status(400).json({
        status: 'error',
        message: 'Se requieren usuarioId, producto y monto',
        data: null,
      });
    }

    const usuarioExiste = await pedidoService.existeUsuario(usuarioId);
    if (!usuarioExiste) {
      return res.status(404).json({
        status: 'error',
        message: `No existe un usuario con id ${usuarioId}`,
        data: null,
      });
    }

    const pedido = await pedidoService.crearPedido({ usuarioId, producto, monto });
    res.status(201).json({
      status: 'success',
      message: 'Pedido creado correctamente',
      data: pedido,
    });
  } catch (error) {
    next(error);
  }
}

// PUT /pedidos/:id
async function actualizarPedido(req, res, next) {
  try {
    const { id } = req.params;
    const existe = await pedidoService.existePedido(id);
    if (!existe) {
      return res.status(404).json({
        status: 'error',
        message: `No existe un pedido con id ${id}`,
        data: null,
      });
    }

    const actualizado = await pedidoService.actualizarPedido(id, req.body);
    if (!actualizado) {
      return res.status(400).json({
        status: 'error',
        message: 'No se recibieron campos válidos para actualizar (producto y/o monto)',
        data: null,
      });
    }

    res.json({
      status: 'success',
      message: `Pedido ${id} actualizado correctamente`,
      data: { id: Number(id), ...req.body },
    });
  } catch (error) {
    next(error);
  }
}

// DELETE /pedidos/:id
async function eliminarPedido(req, res, next) {
  try {
    const { id } = req.params;
    const existe = await pedidoService.existePedido(id);
    if (!existe) {
      return res.status(404).json({
        status: 'error',
        message: `No existe un pedido con id ${id}`,
        data: null,
      });
    }

    await pedidoService.eliminarPedido(id);
    res.json({
      status: 'success',
      message: `Pedido ${id} eliminado correctamente`,
      data: null,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { listarPedidos, crearPedido, actualizarPedido, eliminarPedido };
