// middlewares/validarCampos.middleware.js
// Módulo 8 — Validación de inputs antes de llegar al controlador
// (Lección 2: "Validar inputs y devolver errores controlados").
//
// validarCampos(obligatorios, numericos)
//   - obligatorios: campos que tienen que venir sí o sí en el body.
//   - numericos: campos que, SI vienen, deben ser números mayores que 0
//     (por ejemplo monto o precio). Sirve tanto para crear (POST) como
//     para actualizar (PUT), donde los campos son opcionales.
//   - Además, si viene "email", se revisa que tenga un formato válido.
//
// Ejemplos:
//   router.post('/', validarCampos(['usuarioId', 'producto', 'monto'], ['monto']), ...)
//   router.put('/:id', validarCampos([], ['monto']), ...)

function validarCampos(camposObligatorios = [], camposNumericos = []) {
  return (req, res, next) => {
    const body = req.body || {};

    const faltantes = camposObligatorios.filter(
      (campo) => body[campo] === undefined || body[campo] === null || String(body[campo]).trim() === ''
    );
    if (faltantes.length > 0) {
      return res.status(400).json({
        status: 'error',
        message: `Faltan campos obligatorios: ${faltantes.join(', ')}`,
        data: null,
      });
    }

    const noNumericos = camposNumericos.filter((campo) => {
      if (body[campo] === undefined) return false;
      const valor = Number(body[campo]);
      return typeof body[campo] === 'boolean' || String(body[campo]).trim() === '' || isNaN(valor) || valor <= 0;
    });
    if (noNumericos.length > 0) {
      return res.status(400).json({
        status: 'error',
        message: `Deben ser números mayores que 0: ${noNumericos.join(', ')}`,
        data: null,
      });
    }

    if (body.email !== undefined && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(body.email))) {
      return res.status(400).json({
        status: 'error',
        message: 'El email no tiene un formato válido',
        data: null,
      });
    }

    next();
  };
}

module.exports = validarCampos;
