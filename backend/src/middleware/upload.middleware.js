// src/middlewares/upload.middleware.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Klasör oluşturma
const createDirectoryIfNotExists = (directory) => {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
};

// Depolama ayarları
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // İstek yoluna göre klasör belirleme
    let uploadPath;
    
    // URL yoluna göre klasörü belirle
if (req.originalUrl.includes('/blogs')) {
  uploadPath = path.join(__dirname, '../..', 'uploads/blogs');
  prefix = 'blog';
} else if (req.originalUrl.includes('/agents') || req.originalUrl.includes('/users')) {
  uploadPath = path.join(__dirname, '../..', 'uploads/agents');
  prefix = 'agent';
} else {
  uploadPath = path.join(__dirname, '../..', 'uploads/properties');
  prefix = 'property';
}
    
    createDirectoryIfNotExists(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    
    // İstek yoluna göre dosya öneki belirleme
    let prefix;
    if (req.originalUrl.includes('/agents') || req.originalUrl.includes('/users')) {
      prefix = 'agent';
    } else if (req.originalUrl.includes('/properties')) {
      prefix = 'property';
    } else if (req.originalUrl.includes('/blogs')) {
      prefix = 'blog';
    }
    
    cb(null, prefix + '-' + uniqueSuffix + extension);
  }
});

// Dosya filtreleme
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Desteklenmeyen dosya formatı. Lütfen JPEG, JPG, PNG veya WEBP formatında dosya yükleyin.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

module.exports = upload;