// src/middleware/admin.middleware.js

/**
 * Admin yetki kontrolü yapan middleware
 * Bu middleware, kullanıcının admin olup olmadığını kontrol eder
 * Sadece admin kullanıcılar belirli rotalara erişebilir
 */
module.exports = (req, res, next) => {
  // Auth middleware'inden gelen isAdmin bilgisini kontrol et
  if (!req.isAdmin) {
    return res.status(403).json({ 
      message: 'Bu işlem için yönetici yetkisine sahip olmalısınız',
      success: false
    });
  }
  
  // Kullanıcı admin ise, işleme devam et
  next();
};