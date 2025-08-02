// C:\Users\VICTUS\Desktop\villasantalya\backend\src\routes\property.routes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { 
  getAllProperties, 
  getPropertyById, 
  createProperty, 
  updateProperty, 
  deleteProperty,
  getFeaturedProperties,
  getLatestProperties
} = require('../controllers/property.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// Uploads dizinini oluştur
const uploadDir = path.join(__dirname, '../../uploads/properties');
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
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
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

// Çoklu yükleme alanları
const uploadFields = upload.fields([
  { name: 'mainImage', maxCount: 1 },
  { name: 'images', maxCount: 10 }
]);

// Public routes
router.get('/', getAllProperties);
router.get('/featured', getFeaturedProperties);
router.get('/latest', getLatestProperties);
router.get('/:id', getPropertyById);

// Protected routes
router.post('/', authMiddleware, uploadFields, createProperty);
router.put('/:id', authMiddleware, uploadFields, updateProperty);
router.delete('/:id', authMiddleware, deleteProperty);

module.exports = router;