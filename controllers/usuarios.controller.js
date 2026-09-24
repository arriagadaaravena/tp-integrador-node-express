// controllers/usuarios.controller.js
// Módulo 7 — Rutas de usuarios con SQL manual (mysql2).
// Todas las respuestas siguen el mismo formato { status, message, data }
// usado desde el Módulo 6, para mantener consistencia en toda la API.

const fs = require('fs');
const path = require('path');
const usuarioService = require('../services/usuario.service');

// Tarea PLUS (Lección 4): registrar en un archivo plano las transacciones
// que terminaron en rollback, igual que se hace con logs/log.txt.
const TRANSACCIONES_FALLIDAS_LOG = path.join(__dirname, '..', 'logs', 'transacciones-fallidas.log');

function registrarTransaccionFallida(mensaje) {
  const now = new Date();
  const fecha = now.toISOString().slice(0, 10);
  const hora = now.toISOString().slice(11, 19);
  const linea = `[${fecha} ${hora}] ROLLBACK: ${mensaje}\n`;

  fs.appendFile(TRANSACCIONES_FALLIDAS_LOG, linea, (err) => {
    if (err) console.error('No se pudo escribir en logs/transacciones-fallidas.log:', err.message);
  });
}

// GET /usuarios  (Lección 2)
async function listarUsuarios(req, res, next) {
  try {
    const { nombre, page, limit } = req.query;
    const usuarios = await usuarioService.getUsuarios({ nombre, page, limit });
    res.json({
      status: 'success',
      message: 'Usuarios obtenidos correctamente',
      data: usuarios,
    });
  } catch (error) {
    next(error);
  }
}

// PUT /usuarios/:id  (Lección 3)
async function actualizarUsuario(req, res, next) {
  try {
    const { id } = req.params;
    const existe = await usuarioService.existeUsuario(id);
    if (!existe) {
      return res.status(404).json({
        status: 'error',
        message: `No existe un usuario con id ${id}`,
        data: null,
      });
    }

    // Módulo 8: el email es UNIQUE en la tabla; si ya lo usa otro usuario
    // se responde 409 (conflicto) en vez de un error 500 de MySQL.
    const { nombre, email } = req.body;
    if (email !== undefined && (await usuarioService.emailEnUso(email, id))) {
      return res.status(409).json({
        status: 'error',
        message: 'Ese email ya está registrado por otro usuario',
        data: null,
      });
    }

    const actualizado = await usuarioService.actualizarUsuario(id, { nombre, email });
    if (!actualizado) {
      return res.status(400).json({
        status: 'error',
        message: 'No se recibieron campos válidos para actualizar (nombre y/o email)',
        data: null,
      });
    }

    // Solo se devuelven los campos que realmente se pueden modificar.
    const cambios = {};
    if (nombre !== undefined) cambios.nombre = nombre;
    if (email !== undefined) cambios.email = email;

    res.json({
      status: 'success',
      message: `Usuario ${id} actualizado correctamente`,
      data: { id: Number(id), ...cambios },
    });
  } catch (error) {
    next(error);
  }
}

// DELETE /usuarios/:id  (Lección 3)
async function eliminarUsuario(req, res, next) {
  try {
    const { id } = req.params;
    const existe = await usuarioService.existeUsuario(id);
    if (!existe) {
      return res.status(404).json({
        status: 'error',
        message: `No existe un usuario con id ${id}`,
        data: null,
      });
    }

    await usuarioService.eliminarUsuario(id);
    res.json({
      status: 'success',
      message: `Usuario ${id} eliminado correctamente`,
      data: null,
    });
  } catch (error) {
    next(error);
  }
}

// POST /usuarios/registro-transaccional  (Lección 4)
async function registrarUsuarioConPedido(req, res, next) {
  try {
    const { nombre, email, password, producto, monto, forzarError } = req.body;

    // Módulo 8: se revisa el email antes de abrir la transacción, para
    // responder 409 con un mensaje claro en vez del error interno de MySQL.
    if (await usuarioService.emailEnUso(email)) {
      return res.status(409).json({
        status: 'error',
        message: 'Ya existe un usuario registrado con ese email',
        data: null,
      });
    }

    const resultado = await usuarioService.registrarUsuarioConPedido({
      nombre,
      email,
      password,
      producto,
      monto,
      forzarError,
    });

    res.status(201).json({
      status: 'success',
      message: 'Usuario y pedido registrados correctamente en una sola transacción',
      data: resultado,
    });
  } catch (error) {
    // El rollback ya se ejecutó dentro del service; acá solo se informa
    // el error de forma clara (Requisito mínimo: "Log de éxito o error claro")
    // y se deja evidencia en un archivo plano (Tarea PLUS).
    console.error('Transacción revertida (rollback):', error.message);
    registrarTransaccionFallida(error.message);
    res.status(500).json({
      status: 'error',
      message: `La transacción fue revertida: ${error.message}`,
      data: null,
    });
  }
}

module.exports = {
  listarUsuarios,
  actualizarUsuario,
  eliminarUsuario,
  registrarUsuarioConPedido,
};
