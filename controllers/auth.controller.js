// controllers/auth.controller.js
// Módulo 8 — Registro, login y perfil del usuario autenticado.

const authService = require('../services/auth.service');

// POST /registro  (pública)
async function registrar(req, res, next) {
  try {
    const { nombre, email, password } = req.body;
    const usuario = await authService.registrar({ nombre, email, password });
    res.status(201).json({
      status: 'success',
      message: 'Usuario registrado correctamente. Ahora puedes iniciar sesión en POST /login',
      data: usuario,
    });
  } catch (error) {
    next(error);
  }
}

// POST /login  (pública)
async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const resultado = await authService.login({ email, password });
    res.json({
      status: 'success',
      message: 'Login correcto. Envía el token en la cabecera Authorization: Bearer <token>',
      data: resultado,
    });
  } catch (error) {
    next(error);
  }
}

// GET /perfil  (protegida)
async function perfil(req, res, next) {
  try {
    const usuario = await authService.obtenerPerfil(req.usuario.id);
    if (!usuario) {
      return res.status(404).json({ status: 'error', message: 'Usuario no encontrado', data: null });
    }
    res.json({
      status: 'success',
      message: 'Perfil del usuario autenticado',
      data: usuario,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { registrar, login, perfil };
