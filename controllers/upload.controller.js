// controllers/upload.controller.js
// Módulo 8 — POST /upload: recibe una imagen (ya validada por el middleware
// de multer) y la asocia al perfil del usuario autenticado.

const perfilService = require('../services/perfil.service');

async function subirFoto(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'No se recibió ningún archivo. Envíalo como form-data en el campo "archivo"',
        data: null,
      });
    }

    // Ruta pública del archivo: Express sirve la carpeta uploads/ en /uploads
    const rutaFoto = `/uploads/${req.file.filename}`;
    await perfilService.guardarFoto(req.usuario.id, rutaFoto);

    res.status(201).json({
      status: 'success',
      message: 'Archivo subido y asociado a tu perfil correctamente',
      data: {
        archivo: req.file.filename,
        tipo: req.file.mimetype,
        tamanoKB: Math.round(req.file.size / 1024),
        url: `${req.protocol}://${req.get('host')}${rutaFoto}`,
        usuarioId: req.usuario.id,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { subirFoto };
