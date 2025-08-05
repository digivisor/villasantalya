// src/routes/auth.routes.js
const express = require('express');
const { register, login, getMe } = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');
const router = express.Router();

// authMiddleware bir modül, verifyToken fonksiyonunu kullanmalıyız
router.post('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware.verifyToken, getMe); // Düzeltilmiş satır

module.exports = router;