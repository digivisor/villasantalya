// C:\Users\VICTUS\Desktop\villasantalya\backend\src\controllers\settings.controller.js
const Settings = require('../models/settings.model');
const fs = require('fs');
const path = require('path');

// Site ayarlarını getir
exports.getSettings = async (req, res) => {
  try {
    const settings = await Settings.getInstance();
    
    res.status(200).json({
      settings
    });
  } catch (error) {
    res.status(500).json({
      message: 'Site ayarları alınamadı',
      error: error.message
    });
  }
};

// Site ayarlarını güncelle
exports.updateSettings = async (req, res) => {
  try {
    const settings = await Settings.getInstance();
    
    // Güncellenecek alanlar
    const updateData = { ...req.body };
    
    // Dosyaları kontrol et
    if (req.files) {
      // Logo
      if (req.files.logoImage) {
        // Eski logoyu sil
        if (settings.logoImage) {
          const oldLogoPath = path.join(__dirname, '../../', settings.logoImage);
          if (fs.existsSync(oldLogoPath)) {
            fs.unlinkSync(oldLogoPath);
          }
        }
        updateData.logoImage = `/uploads/settings/${req.files.logoImage[0].filename}`;
      }
      
      // Favicon
      if (req.files.faviconImage) {
        // Eski favicon'u sil
        if (settings.faviconImage) {
          const oldFaviconPath = path.join(__dirname, '../../', settings.faviconImage);
          if (fs.existsSync(oldFaviconPath)) {
            fs.unlinkSync(oldFaviconPath);
          }
        }
        updateData.faviconImage = `/uploads/settings/${req.files.faviconImage[0].filename}`;
      }
    }
    
    // JSON parse işlemi
    if (updateData.socialLinks) updateData.socialLinks = JSON.parse(updateData.socialLinks);
    
    const updatedSettings = await Settings.findByIdAndUpdate(
      settings._id,
      { $set: updateData },
      { new: true }
    );
    
    res.status(200).json({
      message: 'Site ayarları başarıyla güncellendi',
      settings: updatedSettings
    });
  } catch (error) {
    res.status(500).json({
      message: 'Site ayarları güncellenemedi',
      error: error.message
    });
  }
};

// YouTube video ID'sini güncelle
exports.updateYoutubeVideo = async (req, res) => {
  try {
    const { youtubeVideoId } = req.body;
    
    if (!youtubeVideoId) {
      return res.status(400).json({
        message: 'YouTube video ID gerekli'
      });
    }
    
    const settings = await Settings.getInstance();
    settings.youtubeVideoId = youtubeVideoId;
    await settings.save();
    
    res.status(200).json({
      message: 'YouTube video ID başarıyla güncellendi',
      youtubeVideoId
    });
  } catch (error) {
    res.status(500).json({
      message: 'YouTube video ID güncellenemedi',
      error: error.message
    });
  }
};