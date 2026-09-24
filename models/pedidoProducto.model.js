// models/pedidoProducto.model.js
// Módulo 8 — Tabla intermedia de la relación N:M entre Pedido y Producto.
// Además de las dos claves foráneas guarda la "cantidad" de cada producto
// dentro del pedido.

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PedidoProducto = sequelize.define(
    'PedidoProducto',
    {
      pedidoId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        field: 'pedido_id',
      },
      productoId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        field: 'producto_id',
      },
      cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
    },
    {
      tableName: 'pedido_productos',
      timestamps: false,
    }
  );

  return PedidoProducto;
};
