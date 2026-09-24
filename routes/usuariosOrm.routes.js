// routes/usuariosOrm.routes.js
// Módulo 7 — Rutas de usuarios usando el ORM (Sequelize).
// Se dejan en un router aparte de routes/usuarios.routes.js para que
// quede claro, al leer el código, cuáles rutas usan SQL manual y cuáles
// usan el ORM (facilita la comparación pedida en la Lección 5).

const express = require('express');
const router = express.Router();
const usuariosOrmController = require('../controllers/usuariosOrm.controller');

router.get('/', usuariosOrmController.listarUsuariosORM);
router.get('/:id/pedidos', usuariosOrmController.listarUsuarioConPedidosORM);

module.exports = router;
