// routes/usuarios.routes.js
// Rutas de usuarios con SQL manual (mysql2), creadas en el Módulo 7.
// Módulo 8: la lectura sigue siendo pública, pero modificar, eliminar y el
// registro transaccional ahora requieren token, y los datos se validan
// antes de llegar al controlador.

const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuarios.controller');
const verificarToken = require('../middlewares/auth.middleware');
const validarCampos = require('../middlewares/validarCampos.middleware');

router.get('/', usuariosController.listarUsuarios);
router.put('/:id', verificarToken, validarCampos(), usuariosController.actualizarUsuario);
router.delete('/:id', verificarToken, usuariosController.eliminarUsuario);
router.post(
  '/registro-transaccional',
  verificarToken,
  validarCampos(['nombre', 'email', 'password', 'producto', 'monto'], ['monto']),
  usuariosController.registrarUsuarioConPedido
);

module.exports = router;
