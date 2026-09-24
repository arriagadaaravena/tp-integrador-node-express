// models/producto.model.js
// Módulo 8 — Recurso "productos" de la API REST. Se relaciona N:M con
// "pedidos" a través de la tabla intermedia "pedido_productos".

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Producto = sequelize.define(
    'Producto',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      precio: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    },
    {
      tableName: 'productos',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
    }
  );

  return Producto;
};
