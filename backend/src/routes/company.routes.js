// src/routes/company.routes.js
const express = require('express');
const router = express.Router();
const companyController = require('../controllers/company.controller');
const authMiddleware = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

// Test endpoint
router.get('/test', (req, res) => {
  res.json({ message: 'Company routes test successful!' });
});

// Tüm şirketleri getirme
router.get('/', (req, res) => {
  companyController.getAllCompanies(req, res);
});

// Şirket detayı
router.get('/:id', (req, res) => {
  companyController.getCompanyById(req, res);
});

// Şirket ekleme (admin)
router.post('/', authMiddleware.verifyToken, authMiddleware.isAdmin, upload.single('logo'), (req, res) => {
  companyController.createCompany(req, res);
});

// Şirket güncelleme (admin)
router.put('/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, upload.single('logo'), (req, res) => {
  companyController.updateCompany(req, res);
});

// Şirket silme (admin)
router.delete('/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, (req, res) => {
  companyController.deleteCompany(req, res);
});

// Şirket danışmanları
router.get('/:id/agents', (req, res) => {
  companyController.getCompanyAgents(req, res);
});

// Şirket ilanları
router.get('/:id/properties', (req, res) => {
  companyController.getCompanyProperties(req, res);
});

// Bu kısımda sorun olabilir, kontrol et
router.post('/register', (req, res) => {
  companyController.registerCompany(req, res);
});

module.exports = router;