// controllers/status.controller.js
// Devuelve el estado del servidor en JSON — es la ruta que la consigna pide
// como respuesta en JSON (la otra ruta pública, "/", responde en HTML vía
// express.static y public/index.html).

function getStatus(req, res) {
  res.json({
    status: 'success',
    message: 'Servidor funcionando correctamente',
    data: { uptime: process.uptime() },
  });
}

module.exports = { getStatus };
