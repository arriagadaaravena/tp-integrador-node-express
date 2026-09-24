// controllers/usuariosOrm.controller.js
// Módulo 7 — Mismas operaciones de lectura, pero usando el ORM (Sequelize)
// en vez de SQL manual. Ver services/usuarioOrm.service.js.

const usuarioOrmService = require('../services/usuarioOrm.service');

// GET /usuarios-orm  (Lección 5)
async function listarUsuariosORM(req, res, next) {
  try {
    const usuarios = await usuarioOrmService.getUsuariosORM();
    res.json({
      status: 'success',
      message: 'Usuarios obtenidos correctamente (vía ORM)',
      data: usuarios,
    });
  } catch (error) {
    next(error);
  }
}

// GET /usuarios-orm/:id/pedidos  (Lección 6)
async function listarUsuarioConPedidosORM(req, res, next) {
  try {
    const { id } = req.params;
    const usuario = await usuarioOrmService.getUsuarioConPedidosORM(id);

    if (!usuario) {
      return res.status(404).json({
        status: 'error',
        message: `No existe un usuario con id ${id}`,
        data: null,
      });
    }

    res.json({
      status: 'success',
      message: 'Usuario y sus pedidos obtenidos en una sola consulta (ORM + include)',
      data: usuario,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { listarUsuariosORM, listarUsuarioConPedidosORM };
