const Settings = require('../models/setting.model');
const fs = require('fs');
const path = require('path');

exports.getSettings = async (req, res) => {
  try {
    const settings = await Settings.getInstance();
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Site ayarları alınamadı', error: error.message });
  }
};

exports.createSettings = async (req, res) => {
  try {
    const { siteTitle, siteDescription, contactEmail, contactPhone, address, socialLinks } = req.body;
    const settings = new Settings({ siteTitle, siteDescription, contactEmail, contactPhone, address, socialLinks });
    await settings.save();
    res.status(201).json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Site ayarları oluşturulamadı', error: error.message });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const settings = await Settings.getInstance();
    const updateData = { ...req.body };

    // Logo / favicon
    if (req.files) {
      if (req.files.logo) {
        if (settings.logoImage) {
          const oldLogo = path.join(__dirname, '../../', settings.logoImage);
          if (fs.existsSync(oldLogo)) fs.unlinkSync(oldLogo);
        }
        updateData.logoImage = `/uploads/settings/${req.files.logo[0].filename}`;
      }
      if (req.files.favicon) {
        if (settings.faviconImage) {
          const oldFav = path.join(__dirname, '../../', settings.faviconImage);
          if (fs.existsSync(oldFav)) fs.unlinkSync(oldFav);
        }
        updateData.faviconImage = `/uploads/settings/${req.files.favicon[0].filename}`;
      }
    }

    // socialLinks JSON parse
    if (updateData.socialLinks && typeof updateData.socialLinks === 'string') {
      updateData.socialLinks = JSON.parse(updateData.socialLinks);
    }

    const updated = await Settings.findByIdAndUpdate(settings._id, { $set: updateData }, { new: true });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Site ayarları güncellenemedi', error: error.message });
  }
};

exports.getSocialLinks = async (req, res) => {
  try {
    const settings = await Settings.getInstance();
    res.status(200).json(settings.socialLinks || {});
  } catch (error) {
    res.status(500).json({ message: 'Sosyal linkler alınamadı', error: error.message });
  }
};

exports.updateSocialLinks = async (req, res) => {
  try {
    const settings = await Settings.getInstance();
    settings.socialLinks = req.body.socialLinks;
    await settings.save();
    res.status(200).json(settings.socialLinks);
  } catch (error) {
    res.status(500).json({ message: 'Sosyal linkler güncellenemedi', error: error.message });
  }
};

exports.getYoutubeVideo = async (req, res) => {
  try {
    const settings = await Settings.getInstance();
    res.status(200).json({ videoId: settings.youtubeVideoId });
  } catch (error) {
    res.status(500).json({ message: 'YouTube video ID alınamadı', error: error.message });
  }
};

exports.updateYoutubeVideo = async (req, res) => {
  try {
    const { videoId } = req.body;
    if (!videoId) return res.status(400).json({ message: 'videoId gerekli' });

    const settings = await Settings.getInstance();
    settings.youtubeVideoId = videoId;
    await settings.save();

    res.status(200).json({ success: true, videoId });
  } catch (error) {
    res.status(500).json({ message: 'YouTube video ID güncellenemedi', error: error.message });
  }
};
exports.getContactInfo = async (req, res) => {
  try {
    const settings = await Settings.getInstance();
    const contactInfo = {
      address: settings.address || '',
      phone: settings.contactPhone || '',
      email: settings.contactEmail || ''
    };
    res.status(200).json(contactInfo);
  } catch (error) {
    res.status(500).json({ 
      message: 'İletişim bilgileri alınamadı', 
      error: error.message 
    });
  }
};
exports.getWorkingHours = async (req, res) => {
  try {
    const settings = await Settings.getInstance();
    res.status(200).json(settings.workingHours || {});
  } catch (error) {
    res.status(500).json({ 
      message: 'Çalışma saatleri alınamadı', 
      error: error.message 
    });
  }
};

exports.updateWorkingHours = async (req, res) => {
  try {
    const { workingHours } = req.body;
    if (!workingHours) {
      return res.status(400).json({ message: 'Çalışma saatleri gerekli' });
    }

    const settings = await Settings.getInstance();
    settings.workingHours = workingHours;
    await settings.save();
    
    res.status(200).json(settings.workingHours);
  } catch (error) {
    res.status(500).json({ 
      message: 'Çalışma saatleri güncellenemedi', 
      error: error.message 
    });
  }
};
exports.updateContactInfo = async (req, res) => {
  try {
    const { address, phone, email } = req.body;
    const settings = await Settings.getInstance();
    
    settings.address = address;
    settings.contactPhone = phone;
    settings.contactEmail = email;
    
    await settings.save();
    
    res.status(200).json({
      address: settings.address,
      phone: settings.contactPhone,
      email: settings.contactEmail
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'İletişim bilgileri güncellenemedi', 
      error: error.message 
    });
  }
};
