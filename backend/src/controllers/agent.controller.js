// C:\Users\VICTUS\Desktop\villasantalya\backend\src\controllers\agent.controller.js
const User = require('../models/user.model');
const Property = require('../models/property.model');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

// Tüm danışmanları getir
exports.getAllAgents = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = 'name' } = req.query;
    
    // Toplam sayfa sayısını hesapla
    const total = await User.countDocuments({ isActive: true });
    const pageCount = Math.ceil(total / limit);
    
    // Danışmanları getir
    const agents = await User.find({ isActive: true })
      .select('-password -resetPasswordToken -resetPasswordExpires')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('company', 'name');
    
    res.status(200).json({
      agents,
      pagination: {
        total,
        page: Number(page),
        pageSize: Number(limit),
        pageCount
      }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Danışmanlar alınamadı',
      error: error.message
    });
  }
};

// Tek bir danışmanı getir
exports.getAgentById = async (req, res) => {
  try {
    const agent = await User.findById(req.params.id)
      .select('-password -resetPasswordToken -resetPasswordExpires')
      .populate('company', 'name');
      
    if (!agent) {
      return res.status(404).json({
        message: 'Danışman bulunamadı'
      });
    }
    
    // Danışmanın ilanlarını say
    const propertyCount = await Property.countDocuments({ agent: agent._id, status: 'active' });
    
    res.status(200).json({
      agent,
      propertyCount
    });
  } catch (error) {
    res.status(500).json({
      message: 'Danışman alınamadı',
      error: error.message
    });
  }
};

// Danışman oluştur (Admin için)
exports.createAgent = async (req, res) => {
  try {
    const { 
      username, 
      email, 
      password, 
      name, 
      title, 
      phone, 
      about, 
      company, 
      experience, 
      languages, 
      regions,
      specialties,
      social,
      isAdmin,
      isActive
    } = req.body;
    
    // Kullanıcı adı ve e-posta kontrolü
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({
        message: 'Kullanıcı adı veya e-posta zaten kullanımda'
      });
    }
    
    // Resim dosyasını kontrol et
    let image = '/uploads/agents/default-agent.jpg';
    
    if (req.file) {
      image = `/uploads/agents/${req.file.filename}`;
    }
    
    // JSON parse işlemleri
    const parsedLanguages = languages ? JSON.parse(languages) : [];
    const parsedRegions = regions ? JSON.parse(regions) : [];
    const parsedSpecialties = specialties ? JSON.parse(specialties) : [];
    const parsedSocial = social ? JSON.parse(social) : {};
    
    const newAgent = new User({
      username,
      email,
      password,
      name,
      title: title || 'Emlak Danışmanı',
      phone,
      image,
      about,
      company,
      experience: Number(experience) || 0,
      languages: parsedLanguages,
      regions: parsedRegions,
      specialties: parsedSpecialties,
      social: parsedSocial,
      isAdmin: isAdmin === 'true',
      isActive: isActive !== 'false'
    });
    
    await newAgent.save();
    
    res.status(201).json({
      message: 'Danışman başarıyla oluşturuldu',
      agent: {
        id: newAgent._id,
        name: newAgent.name,
        email: newAgent.email,
        username: newAgent.username
      }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Danışman oluşturulamadı',
      error: error.message
    });
  }
};

// Danışman güncelle
exports.updateAgent = async (req, res) => {
  try {
    const agentId = req.params.id;
    
    // Yetki kontrolü
    if (agentId !== req.userId && !req.isAdmin) {
      return res.status(403).json({
        message: 'Bu işlem için yetkiniz yok'
      });
    }
    
    const agent = await User.findById(agentId);
    if (!agent) {
      return res.status(404).json({
        message: 'Danışman bulunamadı'
      });
    }
    
    // Güncellenecek alanlar
    const updateData = { ...req.body };
    
    // Resim dosyasını kontrol et
    if (req.file) {
      // Eski resmi sil
      if (agent.image && agent.image !== '/uploads/agents/default-agent.jpg') {
        const oldImagePath = path.join(__dirname, '../../', agent.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      updateData.image = `/uploads/agents/${req.file.filename}`;
    }
    
    // Şifre güncellemesi varsa
    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    } else {
      delete updateData.password; // Şifre yoksa güncellemeden çıkar
    }
    
    // JSON parse işlemleri
    if (updateData.languages) updateData.languages = JSON.parse(updateData.languages);
    if (updateData.regions) updateData.regions = JSON.parse(updateData.regions);
    if (updateData.specialties) updateData.specialties = JSON.parse(updateData.specialties);
    if (updateData.social) updateData.social = JSON.parse(updateData.social);
    
    // Boolean dönüşümleri
    if (updateData.isAdmin !== undefined) updateData.isAdmin = updateData.isAdmin === 'true';
    if (updateData.isActive !== undefined) updateData.isActive = updateData.isActive === 'true';
    
    const updatedAgent = await User.findByIdAndUpdate(
      agentId,
      { $set: updateData },
      { new: true }
    ).select('-password -resetPasswordToken -resetPasswordExpires');
    
    res.status(200).json({
      message: 'Danışman bilgileri başarıyla güncellendi',
      agent: updatedAgent
    });
  } catch (error) {
    res.status(500).json({
      message: 'Danışman güncellenemedi',
      error: error.message
    });
  }
};

// Danışman sil (deaktif et)
exports.deleteAgent = async (req, res) => {
  try {
    // Sadece admin silebilir
    if (!req.isAdmin) {
      return res.status(403).json({
        message: 'Bu işlem için yönetici yetkisine sahip olmalısınız'
      });
    }
    
    const agent = await User.findById(req.params.id);
    if (!agent) {
      return res.status(404).json({
        message: 'Danışman bulunamadı'
      });
    }
    
    // Danışmanı deaktif et (tamamen silmek yerine)
    agent.isActive = false;
    await agent.save();
    
    res.status(200).json({
      message: 'Danışman başarıyla deaktif edildi'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Danışman silinemedi',
      error: error.message
    });
  }
};

// Danışmanın ilanlarını getir
exports.getAgentProperties = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = '-createdAt' } = req.query;
    
    // Toplam sayfa sayısını hesapla
    const total = await Property.countDocuments({ agent: req.params.id });
    const pageCount = Math.ceil(total / limit);
    
    // İlanları getir
    const properties = await Property.find({ agent: req.params.id })
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    res.status(200).json({
      properties,
      pagination: {
        total,
        page: Number(page),
        pageSize: Number(limit),
        pageCount
      }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Danışmanın ilanları alınamadı',
      error: error.message
    });
  }
};

// Öne çıkan danışmanları getir
exports.getFeaturedAgents = async (req, res) => {
  try {
    const agents = await User.find({ isActive: true })
      .sort('-rating')
      .limit(6)
      .select('name title image rating');
    
    res.status(200).json({
      agents
    });
  } catch (error) {
    res.status(500).json({
      message: 'Öne çıkan danışmanlar alınamadı',
      error: error.message
    });
  }
};

// Danışmanın profilini güncelle
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const agent = await User.findById(userId);
    
    if (!agent) {
      return res.status(404).json({
        message: 'Kullanıcı bulunamadı'
      });
    }
    
    // Güncellenecek alanlar
    const updateData = {
      name: req.body.name,
      title: req.body.title,
      phone: req.body.phone,
      email: req.body.email,
      about: req.body.about,
    };
    
    // Şifre değişikliği varsa
    if (req.body.currentPassword && req.body.newPassword) {
      // Mevcut şifreyi doğrula
      const isMatch = await agent.comparePassword(req.body.currentPassword);
      if (!isMatch) {
        return res.status(400).json({
          message: 'Mevcut şifre yanlış'
        });
      }
      
      // Yeni şifreyi hashle
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(req.body.newPassword, salt);
    }
    
    // Sosyal medya bilgileri
    if (req.body.social) {
      updateData.social = JSON.parse(req.body.social);
    }
    
    // Diller, bölgeler ve uzmanlıklar
    if (req.body.languages) updateData.languages = JSON.parse(req.body.languages);
    if (req.body.regions) updateData.regions = JSON.parse(req.body.regions);
    if (req.body.specialties) updateData.specialties = JSON.parse(req.body.specialties);
    
    // Resim dosyasını kontrol et
    if (req.file) {
      // Eski resmi sil
      if (agent.image && agent.image !== '/uploads/agents/default-agent.jpg') {
        const oldImagePath = path.join(__dirname, '../../', agent.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      updateData.image = `/uploads/agents/${req.file.filename}`;
    }
    
    const updatedAgent = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    ).select('-password -resetPasswordToken -resetPasswordExpires');
    
    res.status(200).json({
      message: 'Profil başarıyla güncellendi',
      agent: updatedAgent
    });
  } catch (error) {
    res.status(500).json({
      message: 'Profil güncellenemedi',
      error: error.message
    });
  }
};