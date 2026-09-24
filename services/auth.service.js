// services/auth.service.js
// Módulo 8 — Registro y login de usuarios (Lección 4).

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Usuario, Perfil } = require('../models');

// Error con código HTTP, para que el controlador sepa qué status devolver.
function errorHttp(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

async function registrar({ nombre, email, password }) {
  if (String(password).length < 6) {
    throw errorHttp(400, 'La contraseña debe tener al menos 6 caracteres');
  }

  const existente = await Usuario.findOne({ where: { email } });
  if (existente) {
    throw errorHttp(409, 'Ya existe un usuario registrado con ese email');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const usuario = await Usuario.create({ nombre, email, password: passwordHash });

  // Nunca se devuelve la contraseña, ni siquiera hasheada.
  return { id: usuario.id, nombre: usuario.nombre, email: usuario.email };
}

async function login({ email, password }) {
  // unscoped() porque el defaultScope del modelo excluye la columna password,
  // y acá sí se necesita para compararla.
  const usuario = await Usuario.unscoped().findOne({ where: { email } });

  // Mismo mensaje si no existe el email o si la contraseña es incorrecta,
  // para no revelar qué emails están registrados.
  if (!usuario || !(await bcrypt.compare(password, usuario.password))) {
    throw errorHttp(401, 'Email o contraseña incorrectos');
  }

  const expiresIn = process.env.JWT_EXPIRES_IN || '1h';
  const token = jwt.sign(
    { id: usuario.id, email: usuario.email },
    process.env.JWT_SECRET,
    { expiresIn }
  );

  return {
    token,
    tipo: 'Bearer',
    expiraEn: expiresIn,
    usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email },
  };
}

// Perfil del usuario autenticado, con su foto (relación 1:1) incluida.
async function obtenerPerfil(usuarioId) {
  return Usuario.findByPk(usuarioId, {
    include: [{ model: Perfil, as: 'perfil', attributes: ['foto', 'updated_at'] }],
  });
}

module.exports = { registrar, login, obtenerPerfil };
