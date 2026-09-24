// routes/auth.routes.js
// Módulo 8 — Autenticación.
//   POST /registro  -> pública
//   POST /login     -> pública, devuelve el JWT
//   GET  /perfil    -> protegida, devuelve el usuario del token + su foto (1:1)

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const verificarToken = require('../middlewares/auth.middleware');
const validarCampos = require('../middlewares/validarCampos.middleware');

router.post('/registro', validarCampos(['nombre', 'email', 'password']), authController.registrar);
router.post('/login', validarCampos(['email', 'password']), authController.login);
router.get('/perfil', verificarToken, authController.perfil);

module.exports = router;
