// C:\Users\VICTUS\Desktop\villasantalya\backend\src\routes\agent.routes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { 
  getAllAgents, 
  getAgentById, 
  createAgent, 
  updateAgent, 
  deleteAgent,
  getAgentProperties,
  getFeaturedAgents,
  updateProfile
} = require('../controllers/agent.controller');
const authMiddleware = require('../middleware/auth.middleware');
const adminMiddleware = require('../middleware/admin.middleware');

const router = express.Router();

// Uploads dizinini oluştur
const uploadDir = path.join(__dirname, '../../uploads/agents');
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
router.get('/', getAllAgents);
router.get('/featured', getFeaturedAgents);
router.get('/:id', getAgentById);
router.get('/:id/properties', getAgentProperties);

// Protected routes
router.post('/', [authMiddleware, adminMiddleware], upload.single('image'), createAgent);
router.put('/:id', authMiddleware, upload.single('image'), updateAgent);
router.delete('/:id', [authMiddleware, adminMiddleware], deleteAgent);
router.put('/profile/me', authMiddleware, upload.single('image'), updateProfile);

module.exports = router;