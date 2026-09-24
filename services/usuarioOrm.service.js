// services/usuarioOrm.service.js
// Módulo 7 — Mismas consultas que usuario.service.js, pero usando el ORM
// (Sequelize) en vez de SQL manual. Sirve para la comparación pedida en
// la Lección 5 ("Comparación de resultados entre SQL manual y ORM").

const { Usuario, Pedido } = require('../models');

// Lección 5 — misma lista de usuarios que getUsuarios() en usuario.service.js,
// pero obtenida con métodos del ORM en vez de una consulta SQL escrita a mano.
async function getUsuariosORM() {
  // defaultScope en el modelo ya excluye la columna "password".
  return Usuario.findAll({ order: [['id', 'ASC']] });
}

// Lección 6 — un usuario junto con todos sus pedidos, en una sola consulta,
// usando "include" para resolver la relación 1:N (Usuario -> Pedidos).
async function getUsuarioConPedidosORM(id) {
  return Usuario.findByPk(id, {
    include: [{ model: Pedido, as: 'pedidos' }],
  });
}

module.exports = { getUsuariosORM, getUsuarioConPedidosORM };
