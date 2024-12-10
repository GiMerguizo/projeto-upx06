const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');

router.post('/login/estagiario', authController.loginEstagiario); // Rota para login de estagiário
router.post('/login/gestor', authController.loginGestor); // Rota para login de gestor

module.exports = router;