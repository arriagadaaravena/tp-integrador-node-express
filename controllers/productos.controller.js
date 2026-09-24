// controllers/productos.controller.js
// Módulo 8 — CRUD del recurso /productos.

const productoService = require('../services/producto.service');

function precioInvalido(precio) {
  return precio !== undefined && (isNaN(Number(precio)) || Number(precio) <= 0);
}

// GET /productos  (pública) — filtros opcionales ?nombre= y ?precioMax=
async function listar(req, res, next) {
  try {
    const productos = await productoService.listar(req.query);
    res.json({ status: 'success', message: 'Productos obtenidos correctamente', data: productos });
  } catch (error) {
    next(error);
  }
}

// GET /productos/:id  (pública)
async function obtener(req, res, next) {
  try {
    const producto = await productoService.obtenerPorId(req.params.id);
    if (!producto) {
      return res.status(404).json({ status: 'error', message: `No existe un producto con id ${req.params.id}`, data: null });
    }
    res.json({ status: 'success', message: 'Producto obtenido correctamente', data: producto });
  } catch (error) {
    next(error);
  }
}

// POST /productos  (protegida)
async function crear(req, res, next) {
  try {
    const { nombre, precio } = req.body;
    if (precioInvalido(precio)) {
      return res.status(400).json({ status: 'error', message: 'El precio debe ser un número mayor que 0', data: null });
    }
    const producto = await productoService.crear({ nombre, precio });
    res.status(201).json({ status: 'success', message: 'Producto creado correctamente', data: producto });
  } catch (error) {
    next(error);
  }
}

// PUT /productos/:id  (protegida)
async function actualizar(req, res, next) {
  try {
    const { nombre, precio } = req.body;
    if (nombre === undefined && precio === undefined) {
      return res.status(400).json({ status: 'error', message: 'No se recibieron campos válidos para actualizar (nombre y/o precio)', data: null });
    }
    if (precioInvalido(precio)) {
      return res.status(400).json({ status: 'error', message: 'El precio debe ser un número mayor que 0', data: null });
    }

    const producto = await productoService.actualizar(req.params.id, { nombre, precio });
    if (!producto) {
      return res.status(404).json({ status: 'error', message: `No existe un producto con id ${req.params.id}`, data: null });
    }
    res.json({ status: 'success', message: `Producto ${req.params.id} actualizado correctamente`, data: producto });
  } catch (error) {
    next(error);
  }
}

// DELETE /productos/:id  (protegida)
async function eliminar(req, res, next) {
  try {
    const eliminado = await productoService.eliminar(req.params.id);
    if (!eliminado) {
      return res.status(404).json({ status: 'error', message: `No existe un producto con id ${req.params.id}`, data: null });
    }
    res.json({ status: 'success', message: `Producto ${req.params.id} eliminado correctamente`, data: null });
  } catch (error) {
    next(error);
  }
}

module.exports = { listar, obtener, crear, actualizar, eliminar };
