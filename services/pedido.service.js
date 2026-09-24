// services/pedido.service.js
// CRUD con SQL manual sobre la segunda entidad clave del proyecto:
// "pedidos". Se agrega para que ambas entidades (usuarios y pedidos)
// tengan operaciones completas de lectura, escritura y eliminación,
// tal como pide la consigna ("operaciones CRUD completas sobre al menos
// dos entidades clave").

const { pool } = require('../config/db');

async function existeUsuario(usuarioId) {
  const [rows] = await pool.query('SELECT id FROM usuarios WHERE id = ?', [usuarioId]);
  return rows.length > 0;
}

async function existePedido(id) {
  const [rows] = await pool.query('SELECT id FROM pedidos WHERE id = ?', [id]);
  return rows.length > 0;
}

async function getPedidos({ usuarioId } = {}) {
  let sql = 'SELECT id, producto, monto, usuario_id, created_at FROM pedidos';
  const params = [];

  if (usuarioId) {
    sql += ' WHERE usuario_id = ?';
    params.push(usuarioId);
  }

  sql += ' ORDER BY id ASC';
  const [rows] = await pool.query(sql, params);
  return rows;
}

async function crearPedido({ usuarioId, producto, monto }) {
  const [result] = await pool.query(
    'INSERT INTO pedidos (producto, monto, usuario_id) VALUES (?, ?, ?)',
    [producto, monto, usuarioId]
  );
  return { id: result.insertId, usuarioId, producto, monto };
}

async function actualizarPedido(id, { producto, monto }) {
  const campos = [];
  const valores = [];

  if (producto !== undefined) {
    campos.push('producto = ?');
    valores.push(producto);
  }
  if (monto !== undefined) {
    campos.push('monto = ?');
    valores.push(monto);
  }

  if (campos.length === 0) return false;

  valores.push(id);
  const [result] = await pool.query(
    `UPDATE pedidos SET ${campos.join(', ')} WHERE id = ?`,
    valores
  );
  return result.affectedRows > 0;
}

async function eliminarPedido(id) {
  const [result] = await pool.query('DELETE FROM pedidos WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = {
  existeUsuario,
  existePedido,
  getPedidos,
  crearPedido,
  actualizarPedido,
  eliminarPedido,
};
