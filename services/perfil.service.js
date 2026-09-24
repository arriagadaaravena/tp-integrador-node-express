// services/perfil.service.js
// Módulo 8 — Asocia el archivo subido con POST /upload al perfil del
// usuario autenticado (relación 1:1 Usuario <-> Perfil). Tarea PLUS de la
// Lección 3: "asociar los archivos subidos a un registro en la base de datos".

const { Perfil } = require('../models');

// Crea el perfil si no existe, o reemplaza la foto si ya tenía una.
async function guardarFoto(usuarioId, rutaFoto) {
  const [perfil, creado] = await Perfil.findOrCreate({
    where: { usuarioId },
    defaults: { foto: rutaFoto },
  });

  if (!creado) {
    perfil.foto = rutaFoto;
    await perfil.save();
  }

  return perfil;
}

module.exports = { guardarFoto };
