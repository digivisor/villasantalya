// agent.routes.js
const express = require('express');
const router = express.Router();
const agentController = require('../controllers/agent.controller');
const authMiddleware = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

// Önce profil rotalarını tanımlayın
router.get('/profile', authMiddleware.verifyToken, (req, res) => {
  console.log('Profile route called with userId:', req.userId);
  agentController.getProfile(req, res);
});

// agent.routes.js'de
router.put('/profile', authMiddleware.verifyToken, upload.single('image'), (req, res) => {
  // Burada updateAgentProfile yerine updateProfile kullanmanız gerekebilir
  agentController.updateProfile(req, res);
});
router.put('/profile/password', authMiddleware.verifyToken, (req, res) => {
  agentController.updatePassword(req, res);
});

// Test endpoint
router.get('/test', (req, res) => {
  res.json({ message: 'Agent routes test successful!' });
});

// Diğer tüm rotalar
router.get('/', (req, res) => {
  agentController.getAllAgents(req, res);
});

// ID parametresi içeren rotalar en sonda olmalı
router.get('/:id', (req, res) => {
  agentController.getAgentById(req, res);
});

router.put('/:id', authMiddleware.verifyToken, upload.single('image'), (req, res) => {
  agentController.updateAgent(req, res);
});

router.delete('/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, (req, res) => {
  agentController.deleteAgent(req, res);
});

router.get('/:id/teams', authMiddleware.verifyToken, (req, res) => {
  agentController.getAgentTeams(req, res);
});

router.get('/:id/properties', (req, res) => {
  agentController.getAgentProperties(req, res);
});

router.patch('/:id/toggle-active', authMiddleware.verifyToken, authMiddleware.isAdmin, (req, res) => {
  agentController.toggleAgentActive(req, res);
});

router.post('/register', (req, res) => {
  agentController.createAgent(req, res);
});

module.exports = router;