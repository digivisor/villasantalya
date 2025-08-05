// src/routes/settings.routes.js
const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settings.controller');
const authMiddleware = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

// Test endpoint
router.get('/test', (req, res) => {
  res.json({ message: 'Settings routes test successful!' });
});

// Genel ayarlar
router.get('/general', (req, res) => {
  settingsController.getGeneralSettings(req, res);
});

// Genel ayarları güncelleme (admin)
router.put('/general', authMiddleware.verifyToken, authMiddleware.isAdmin, (req, res) => {
  settingsController.updateGeneralSettings(req, res);
});

// Site ayarları
router.get('/site', (req, res) => {
  settingsController.getSiteSettings(req, res);
});

// Site ayarlarını güncelleme (admin)
router.put('/site', authMiddleware.verifyToken, authMiddleware.isAdmin, upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'favicon', maxCount: 1 }
]), (req, res) => {
  settingsController.updateSiteSettings(req, res);
});

// İletişim ayarları
router.get('/contact', (req, res) => {
  settingsController.getContactSettings(req, res);
});

// İletişim ayarlarını güncelleme (admin)
router.put('/contact', authMiddleware.verifyToken, authMiddleware.isAdmin, (req, res) => {
  settingsController.updateContactSettings(req, res);
});

// Sosyal medya ayarları
router.get('/social', (req, res) => {
  settingsController.getSocialSettings(req, res);
});

// Sosyal medya ayarlarını güncelleme (admin)
router.put('/social', authMiddleware.verifyToken, authMiddleware.isAdmin, (req, res) => {
  settingsController.updateSocialSettings(req, res);
});

module.exports = router;