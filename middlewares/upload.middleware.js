// middlewares/upload.middleware.js
// Módulo 8 — Subida de archivos con multer (Lección 3).
//
// - Los archivos se guardan en la carpeta pública "uploads/" (servida por
//   Express en /uploads), con un nombre único para no pisar archivos.
// - Solo se aceptan imágenes JPG, PNG o WEBP.
// - Tamaño máximo: 2 MB.
// Cualquier error (tipo o tamaño) se responde como JSON 400, con el mismo
// formato { status, message, data } del resto de la API.

const path = require('path');
const multer = require('multer');

const TIPOS_PERMITIDOS = ['image/jpeg', 'image/png', 'image/webp'];
const EXTENSIONES_PERMITIDAS = ['.jpg', '.jpeg', '.png', '.webp'];
const TAMANO_MAXIMO = 2 * 1024 * 1024; // 2 MB

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const nombreUnico = `usuario-${req.usuario.id}-${Date.now()}${extension}`;
    cb(null, nombreUnico);
  },
});

// Se revisan DOS cosas: el tipo que declara el cliente (mimetype) y la
// extensión del nombre del archivo. Con solo una de las dos, bastaría con
// renombrar un archivo o cambiar su tipo para colar algo que no es imagen.
function fileFilter(req, file, cb) {
  const extension = path.extname(file.originalname).toLowerCase();
  if (TIPOS_PERMITIDOS.includes(file.mimetype) && EXTENSIONES_PERMITIDAS.includes(extension)) {
    cb(null, true);
  } else {
    const error = new Error('Tipo de archivo no permitido. Solo se aceptan imágenes JPG, PNG o WEBP');
    error.statusCode = 400;
    cb(error);
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: TAMANO_MAXIMO },
});

// Envuelve upload.single() para transformar los errores de multer en
// respuestas JSON claras en vez de dejar que exploten como error 500.
function subirImagen(campo) {
  return (req, res, next) => {
    upload.single(campo)(req, res, (error) => {
      if (!error) return next();

      let message = error.message;
      if (error.code === 'LIMIT_FILE_SIZE') {
        message = 'El archivo supera el tamaño máximo permitido (2 MB)';
      } else if (error.code === 'LIMIT_UNEXPECTED_FILE') {
        message = `El archivo debe enviarse en el campo "${campo}"`;
      }

      return res.status(400).json({ status: 'error', message, data: null });
    });
  };
}

module.exports = { subirImagen };
