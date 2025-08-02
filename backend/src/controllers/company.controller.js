// C:\Users\VICTUS\Desktop\villasantalya\backend\src\controllers\company.controller.js
const Company = require('../models/company.model');
const User = require('../models/user.model');
const fs = require('fs');
const path = require('path');

// Tüm şirketleri getir
exports.getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find();
    
    res.status(200).json({
      companies
    });
  } catch (error) {
    res.status(500).json({
      message: 'Şirketler alınamadı',
      error: error.message
    });
  }
};

// Tek bir şirketi getir
exports.getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
      
    if (!company) {
      return res.status(404).json({
        message: 'Şirket bulunamadı'
      });
    }
    
    // Şirketin danışmanlarını say
    const agentCount = await User.countDocuments({ company: company._id, isActive: true });
    
    res.status(200).json({
      company,
      agentCount
    });
  } catch (error) {
    res.status(500).json({
      message: 'Şirket alınamadı',
      error: error.message
    });
  }
};

// Yeni şirket oluştur
exports.createCompany = async (req, res) => {
  try {
    const { 
      name, 
      description, 
      address, 
      phone, 
      email, 
      website, 
      social, 
      isActive 
    } = req.body;
    
    // Logo dosyasını kontrol et
    let logo = '/uploads/companies/default-logo.jpg';
    
    if (req.file) {
      logo = `/uploads/companies/${req.file.filename}`;
    }
    
    // JSON parse işlemi
    const parsedSocial = social ? JSON.parse(social) : {};
    
    const newCompany = new Company({
      name,
      logo,
      description,
      address,
      phone,
      email,
      website,
      social: parsedSocial,
      isActive: isActive !== 'false'
    });
    
    await newCompany.save();
    
    res.status(201).json({
      message: 'Şirket başarıyla oluşturuldu',
      company: newCompany
    });
  } catch (error) {
    res.status(500).json({
      message: 'Şirket oluşturulamadı',
      error: error.message
    });
  }
};

// Şirket güncelle
exports.updateCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    
    if (!company) {
      return res.status(404).json({
        message: 'Şirket bulunamadı'
      });
    }
    
    // Güncellenecek alanlar
    const updateData = { ...req.body };
    
    // Logo dosyasını kontrol et
    if (req.file) {
      // Eski logoyu sil
      if (company.logo && company.logo !== '/uploads/companies/default-logo.jpg') {
        const oldLogoPath = path.join(__dirname, '../../', company.logo);
        if (fs.existsSync(oldLogoPath)) {
          fs.unlinkSync(oldLogoPath);
        }
      }
      updateData.logo = `/uploads/companies/${req.file.filename}`;
    }
    
    // JSON parse işlemi
    if (updateData.social) updateData.social = JSON.parse(updateData.social);
    
    // Boolean dönüşümleri
    if (updateData.isActive !== undefined) updateData.isActive = updateData.isActive === 'true';
    
    const updatedCompany = await Company.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );
    
    res.status(200).json({
      message: 'Şirket başarıyla güncellendi',
      company: updatedCompany
    });
  } catch (error) {
    res.status(500).json({
      message: 'Şirket güncellenemedi',
      error: error.message
    });
  }
};

// Şirket sil
exports.deleteCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    
    if (!company) {
      return res.status(404).json({
        message: 'Şirket bulunamadı'
      });
    }
    
    // Şirketin danışmanlarını kontrol et
    const hasAgents = await User.exists({ company: company._id });
    if (hasAgents) {
      return res.status(400).json({
        message: 'Bu şirket silinemiyor çünkü danışmanları var'
      });
    }
    
    // Logo dosyasını sil
    if (company.logo && company.logo !== '/uploads/companies/default-logo.jpg') {
      const logoPath = path.join(__dirname, '../../', company.logo);
      if (fs.existsSync(logoPath)) {
        fs.unlinkSync(logoPath);
      }
    }
    
    await Company.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      message: 'Şirket başarıyla silindi'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Şirket silinemedi',
      error: error.message
    });
  }
};

// Şirketin danışmanlarını getir
exports.getCompanyAgents = async (req, res) => {
  try {
    const agents = await User.find({ company: req.params.id, isActive: true })
      .select('-password -resetPasswordToken -resetPasswordExpires');
    
    res.status(200).json({
      agents
    });
  } catch (error) {
    res.status(500).json({
      message: 'Şirket danışmanları alınamadı',
      error: error.message
    });
  }
};