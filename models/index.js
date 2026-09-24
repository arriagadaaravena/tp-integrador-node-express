// models/index.js
// Módulo 7 — Acceso a datos con ORM (Lección 5) y relaciones (Lección 6).
//
// Se configura una instancia de Sequelize independiente del pool "crudo"
// de config/db.js, apuntando a la misma base de datos. Esto permite
// comparar, sobre los mismos datos, el resultado de una consulta SQL
// manual (mysql2) contra la misma consulta hecha con el ORM.

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

// Relación 1:N (Lección 6) — un Usuario tiene muchos Pedidos.
Usuario.hasMany(Pedido, { foreignKey: 'usuarioId', as: 'pedidos' });
Pedido.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuario' });

module.exports = { sequelize, Usuario, Pedido };
