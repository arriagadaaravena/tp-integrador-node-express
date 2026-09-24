// services/usuario.service.js
// Módulo 7 — Lógica de acceso a datos con SQL manual (mysql2), separada
// de las rutas y controladores siguiendo la arquitectura modular pedida
// por la pauta (routes / controllers / middlewares / services).

const bcrypt = require('bcryptjs');
const { pool } = require('../config/db');

// Lección 2 — Obtención de información, con filtro opcional por nombre
// (Tarea PLUS: ?nombre=Juan) y paginación opcional (Tarea PLUS: ?page/&limit).
async function getUsuarios({ nombre, page, limit } = {}) {
  // Nunca se selecciona la columna "password": es el dato sensible que no
  // debe salir en la respuesta (ver justificación en el README).
  let sql = 'SELECT id, nombre, email, created_at FROM usuarios';
  const params = [];

  if (nombre) {
    sql += ' WHERE nombre LIKE ?';
    params.push(`%${nombre}%`);
  }

  sql += ' ORDER BY id ASC';

  if (page && limit) {
    const offset = (Number(page) - 1) * Number(limit);
    sql += ' LIMIT ? OFFSET ?';
    params.push(Number(limit), offset);
  }

  const [rows] = await pool.query(sql, params);
  return rows;
}

// Módulo 8: revisa si un email ya pertenece a OTRO usuario, para responder
// 409 en vez de dejar que MySQL rechace el UNIQUE con un error 500.
async function emailEnUso(email, excluirId = null) {
  const [rows] = await pool.query(
    'SELECT id FROM usuarios WHERE email = ? AND id <> ?',
    [email, excluirId === null ? 0 : excluirId]
  );
  return rows.length > 0;
}

async function existeUsuario(id) {
  const [rows] = await pool.query('SELECT id FROM usuarios WHERE id = ?', [id]);
  return rows.length > 0;
}

// Lección 3 — Modificación de datos: solo se permite actualizar "nombre"
// y "email" (nunca la contraseña desde esta ruta genérica; cambiar una
// contraseña amerita su propio endpoint con más validaciones, algo que se
// evalúa en el Módulo 8 junto con la autenticación).
async function actualizarUsuario(id, { nombre, email }) {
  const campos = [];
  const valores = [];

  if (nombre !== undefined) {
    campos.push('nombre = ?');
    valores.push(nombre);
  }
  if (email !== undefined) {
    campos.push('email = ?');
    valores.push(email);
  }

  if (campos.length === 0) {
    return false;
  }

  valores.push(id);
  const [result] = await pool.query(
    `UPDATE usuarios SET ${campos.join(', ')} WHERE id = ?`,
    valores
  );
  return result.affectedRows > 0;
}

async function eliminarUsuario(id) {
  const [result] = await pool.query('DELETE FROM usuarios WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

// Lección 4 — Transaccionalidad: registra un usuario y, en la misma
// transacción, su primer pedido. Si "forzarError" viene en true, se
// interrumpe a propósito después de insertar el usuario para comprobar
// que el rollback deja la base de datos sin cambios (ni el usuario ni el
// pedido quedan guardados).
async function registrarUsuarioConPedido({ nombre, email, password, producto, monto, forzarError }) {
  // Iteración Módulo 8: antes la contraseña se guardaba tal cual llegaba.
  // Ahora se hashea con bcrypt, igual que en POST /registro, para que estos
  // usuarios también puedan iniciar sesión en POST /login.
  const passwordHash = await bcrypt.hash(String(password), 10);

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [usuarioResult] = await connection.query(
      'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)',
      [nombre, email, passwordHash]
    );
    const usuarioId = usuarioResult.insertId;

    if (forzarError) {
      throw new Error('Error forzado a propósito para comprobar el rollback.');
    }

    const [pedidoResult] = await connection.query(
      'INSERT INTO pedidos (producto, monto, usuario_id) VALUES (?, ?, ?)',
      [producto, monto, usuarioId]
    );

    await connection.commit();
    return { usuarioId, pedidoId: pedidoResult.insertId };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = {
  getUsuarios,
  emailEnUso,
  existeUsuario,
  actualizarUsuario,
  eliminarUsuario,
  registrarUsuarioConPedido,
};
