// services/pedidoOrm.service.js
// Módulo 8 — Relación N:M entre Pedido y Producto usando el ORM.

const { Pedido, Producto, PedidoProducto } = require('../models');

// Un pedido con todos sus productos (y la cantidad de cada uno, que vive
// en la tabla intermedia pedido_productos).
async function obtenerConProductos(pedidoId) {
  return Pedido.findByPk(pedidoId, {
    include: [
      {
        model: Producto,
        as: 'productos',
        through: { attributes: ['cantidad'] },
      },
    ],
  });
}

// Agrega un producto a un pedido. Si ya estaba, suma la cantidad.
// Devuelve null si el pedido o el producto no existen.
async function agregarProducto(pedidoId, productoId, cantidad) {
  const [pedido, producto] = await Promise.all([
    Pedido.findByPk(pedidoId),
    Producto.findByPk(productoId),
  ]);
  if (!pedido || !producto) return null;

  const existente = await PedidoProducto.findOne({ where: { pedidoId, productoId } });
  if (existente) {
    existente.cantidad += cantidad;
    await existente.save();
  } else {
    await PedidoProducto.create({ pedidoId, productoId, cantidad });
  }

  return obtenerConProductos(pedidoId);
}

module.exports = { obtenerConProductos, agregarProducto };
