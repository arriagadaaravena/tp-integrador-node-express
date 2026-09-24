// models/pedido.model.js
// Modelo Sequelize para la tabla "pedidos": segunda entidad clave del
// proyecto, relacionada con "usuarios" (Lección 6) y usada también en la
// operación transaccional de la Lección 4.

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Pedido = sequelize.define(
    'Pedido',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      producto: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      monto: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      usuarioId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'usuario_id',
      },
    },
    {
      tableName: 'pedidos',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
    }
  );

  return Pedido;
};
