// C:\Users\VICTUS\Desktop\villasantalya\backend\src\routes\company.routes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { 
  getAllCompanies, 
  getCompanyById, 
  createCompany, 
  updateCompany, 
  deleteCompany,
  getCompanyAgents
} = require('../controllers/company.controller');
const authMiddleware = require('../middleware/auth.middleware');
const adminMiddleware = require('../middleware/admin.middleware');

const router = express.Router();

// Uploads dizinini oluştur
const uploadDir = path.join(__dirname, '../../uploads/companies');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Dosya yükleme konfigürasyonu
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    
    cb(new Error('Sadece resim dosyaları yüklenebilir'));
  }
});

// Public routes
router.get('/', getAllCompanies);
router.get('/:id', getCompanyById);
router.get('/:id/agents', getCompanyAgents);

// Protected routes
router.post('/', [authMiddleware, adminMiddleware], upload.single('logo'), createCompany);
router.put('/:id', [authMiddleware, adminMiddleware], upload.single('logo'), updateCompany);
router.delete('/:id', [authMiddleware, adminMiddleware], deleteCompany);

module.exports = router;