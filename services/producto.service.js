// services/producto.service.js
// Módulo 8 — CRUD del recurso "productos" usando el ORM (Sequelize).

const { Op } = require('sequelize');
const { Producto } = require('../models');

// Filtros opcionales: ?nombre=teclado  y/o  ?precioMax=50000
async function listar({ nombre, precioMax } = {}) {
  const where = {};
  if (nombre) where.nombre = { [Op.like]: `%${nombre}%` };
  if (precioMax) where.precio = { [Op.lte]: Number(precioMax) };

  return Producto.findAll({ where, order: [['id', 'ASC']] });
}

async function obtenerPorId(id) {
  return Producto.findByPk(id);
}

async function crear({ nombre, precio }) {
  return Producto.create({ nombre, precio });
}

// Devuelve el producto actualizado, o null si no existe.
async function actualizar(id, { nombre, precio }) {
  const producto = await Producto.findByPk(id);
  if (!producto) return null;

  if (nombre !== undefined) producto.nombre = nombre;
  if (precio !== undefined) producto.precio = precio;
  await producto.save();
  return producto;
}

// Devuelve true si se eliminó, false si no existía.
async function eliminar(id) {
  const filas = await Producto.destroy({ where: { id } });
  return filas > 0;
}

module.exports = { listar, obtenerPorId, crear, actualizar, eliminar };
