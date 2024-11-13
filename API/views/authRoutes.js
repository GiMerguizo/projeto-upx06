const express = require('express');
const router = express.Router();
const authController = require('../controllers/estagiarioAuthController');

router.post('/login', authController.login);

module.exports = router;