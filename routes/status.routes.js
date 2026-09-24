// routes/status.routes.js
const { Router } = require('express');
const { getStatus } = require('../controllers/status.controller');

const router = Router();

router.get('/', getStatus);

module.exports = router;
