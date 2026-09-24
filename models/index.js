// models/index.js
// Instancia de Sequelize + definición de todos los modelos y sus relaciones.
//
// Módulo 7: Usuario 1:N Pedido.
// Módulo 8: se completan los tres tipos de relación que pide la consigna:
//   - 1:1  Usuario <-> Perfil          (foto de usuario subida con POST /upload)
//   - 1:N  Usuario <-> Pedido          (ya existía desde el Módulo 7)
//   - N:M  Pedido  <-> Producto        (tabla intermedia pedido_productos)

require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false, // evita ensuciar la consola con el SQL interno de Sequelize
  }
);

const Usuario = require('./usuario.model')(sequelize);
const Pedido = require('./pedido.model')(sequelize);
const Producto = require('./producto.model')(sequelize);
const PedidoProducto = require('./pedidoProducto.model')(sequelize);
const Perfil = require('./perfil.model')(sequelize);

// 1:N — un Usuario tiene muchos Pedidos.
Usuario.hasMany(Pedido, { foreignKey: 'usuarioId', as: 'pedidos' });
Pedido.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuario' });

// 1:1 — un Usuario tiene un Perfil.
Usuario.hasOne(Perfil, { foreignKey: 'usuarioId', as: 'perfil' });
Perfil.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuario' });

// N:M — un Pedido tiene muchos Productos y un Producto está en muchos Pedidos.
Pedido.belongsToMany(Producto, {
  through: PedidoProducto,
  foreignKey: 'pedidoId',
  otherKey: 'productoId',
  as: 'productos',
});
Producto.belongsToMany(Pedido, {
  through: PedidoProducto,
  foreignKey: 'productoId',
  otherKey: 'pedidoId',
  as: 'pedidos',
});

module.exports = { sequelize, Usuario, Pedido, Producto, PedidoProducto, Perfil };
