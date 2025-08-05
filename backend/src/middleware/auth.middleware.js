// src/middleware/auth.middleware.js
const jwt = require('jsonwebtoken');

// Token doğrulama
exports.verifyToken = (req, res, next) => {
  console.log('Headers:', req.headers);
  
  // İki header'ı da kontrol et (eski ve yeni format)
  const tokenFromHeader = req.header('x-auth-token');
  const authHeader = req.header('authorization');
  
  let token = tokenFromHeader;
  
  // Authorization header varsa ve Bearer formatındaysa
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
    console.log('Bearer token found:', token.substring(0, 10) + '...');
  }
  
  if (!token) {
    console.log('No token found in headers');
    return res.status(401).json({ message: 'Yetkilendirme hatası, token yok' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token verified, user ID:', decoded.id);
    req.userId = decoded.id;
    req.isAdmin = decoded.isAdmin;
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(401).json({ message: 'Geçersiz token' });
  }
};

// Admin kontrolü
exports.isAdmin = (req, res, next) => {
  if (!req.isAdmin) {
    return res.status(403).json({ message: 'Bu işleme yetkiniz yok' });
  }
  next();
};