  // src/routes/property.routes.js
  const express = require('express');
  const multer = require('multer');
  const path = require('path');
  const fs = require('fs');
  const { verifyToken } = require('../middleware/auth.middleware');
  const propertyController = require('../controllers/property.controller');

  const router = express.Router();

  // Uploads klasörünün varlığını kontrol et ve yoksa oluştur
  const uploadDir = path.join(__dirname, '../../uploads/properties');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('Uploads directory created:', uploadDir);
  }

  // Depolama yapılandırması
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '../../uploads/properties'));
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  });

  // Dosya filtreleme
  const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Sadece resim dosyaları yüklenebilir!'), false);
    }
  };

  // Multer yapılandırması
  const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// Debug için bir middleware ekleyelim
const debugMiddleware = (req, res, next) => {
  console.log('Request received at:', new Date().toISOString());
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  console.log('Method:', req.method);
  console.log('URL:', req.originalUrl);
  next();
};

// İlan ekleme - upload.array yerine manuel multer yapılandırması
router.post('/', debugMiddleware, verifyToken, (req, res, next) => {
  upload.array('images', 10)(req, res, function(err) {
    if (err) {
      console.error('Multer error:', err);
      return res.status(400).json({ message: err.message });
    }
    
    console.log('Files processed:', req.files ? req.files.length : 'No files');
    next();
  });
}, propertyController.createProperty);


// property.routes.js dosyasını şu şekilde düzenleyin

// Tüm ilanları getir
router.get('/', propertyController.getAllProperties);

// Özel rotalar - Bunlar en üstte olmalı
router.get('/pending', verifyToken, propertyController.getPendingProperties);
router.get('/my-properties', verifyToken, propertyController.getMyProperties);

// Parametreli rotalar - Bunlar en sonda olmalı
router.get('/by-slug/:slug', propertyController.getPropertyBySlug);
router.get('/:id', propertyController.getPropertyById);

// Güncelleme ve silme işlemleri
router.put('/:id', verifyToken, upload.array('images', 10), propertyController.updateProperty);
router.delete('/:id', verifyToken, propertyController.deleteProperty);

// Admin işlemleri
router.put('/:id/approve', verifyToken, propertyController.approveProperty);
router.put('/:id/reject', verifyToken, propertyController.rejectProperty);

  module.exports = router;