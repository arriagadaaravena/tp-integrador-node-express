// routes/usuarios.routes.js
// Módulo 7 — Rutas de usuarios con SQL manual (mysql2).

const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuarios.controller');

router.get('/', usuariosController.listarUsuarios);
router.put('/:id', usuariosController.actualizarUsuario);
router.delete('/:id', usuariosController.eliminarUsuario);
router.post('/registro-transaccional', usuariosController.registrarUsuarioConPedido);

module.exports = router;
