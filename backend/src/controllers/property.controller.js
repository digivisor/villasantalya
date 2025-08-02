// C:\Users\VICTUS\Desktop\villasantalya\backend\src\controllers\property.controller.js
const Property = require('../models/property.model');
const fs = require('fs');
const path = require('path');

// Tüm ilanları getir
exports.getAllProperties = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      sort = '-createdAt',
      location,
      type,
      propertyType,
      minPrice,
      maxPrice,
      beds,
      baths,
      search,
      agent
    } = req.query;
    
    const query = {};
    
    // Filtreler
    if (location) query.location = { $regex: location, $options: 'i' };
    if (type) query.type = type;
    if (propertyType) query.propertyType = propertyType;
    if (minPrice) query.price = { ...query.price, $gte: Number(minPrice) };
    if (maxPrice) query.price = { ...query.price, $lte: Number(maxPrice) };
    if (beds) query.beds = Number(beds);
    if (baths) query.baths = Number(baths);
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (agent) query.agent = agent;
    
    // Toplam sayfa sayısını hesapla
    const total = await Property.countDocuments(query);
    const pageCount = Math.ceil(total / limit);
    
    // İlanları getir
    const properties = await Property.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('agent', 'name image title phone email');
    
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
      message: 'İlanlar alınamadı',
      error: error.message
    });
  }
};

// Tek bir ilan getir
exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('agent', 'name image title phone email languages');
      
    if (!property) {
      return res.status(404).json({
        message: 'İlan bulunamadı'
      });
    }
    
    res.status(200).json({
      property
    });
  } catch (error) {
    res.status(500).json({
      message: 'İlan alınamadı',
      error: error.message
    });
  }
};

// Yeni ilan oluştur
exports.createProperty = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      price, 
      location, 
      fullAddress, 
      type, 
      propertyType, 
      area, 
      beds, 
      baths,
      features,
      tag,
      latitude,
      longitude,
      agent,
      isFeatured,
      status
    } = req.body;
    
    // Resim dosyalarını kontrol et
    let mainImage = '';
    let images = [];
    
    if (req.files) {
      // Ana resim
      if (req.files.mainImage) {
        mainImage = `/uploads/properties/${req.files.mainImage[0].filename}`;
      }
      
      // Diğer resimler
      if (req.files.images) {
        images = req.files.images.map(file => `/uploads/properties/${file.filename}`);
      }
    }
    
    const newProperty = new Property({
      title,
      description,
      price,
      discountedPrice: req.body.discountedPrice,
      location,
      fullAddress,
      type,
      propertyType,
      area,
      beds,
      baths,
      mainImage: mainImage || '/uploads/properties/default.jpg',
      images,
      features: features ? JSON.parse(features) : [],
      tag,
      latitude,
      longitude,
      agent: agent || req.userId,
      isFeatured: isFeatured === 'true',
      status: status || 'active',
      createdBy: req.userId
    });
    
    await newProperty.save();
    
    res.status(201).json({
      message: 'İlan başarıyla oluşturuldu',
      property: newProperty
    });
  } catch (error) {
    res.status(500).json({
      message: 'İlan oluşturulamadı',
      error: error.message
    });
  }
};

// İlan güncelle
exports.updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({
        message: 'İlan bulunamadı'
      });
    }
    
    // Yetki kontrolü
    if (property.createdBy.toString() !== req.userId && !req.isAdmin) {
      return res.status(403).json({
        message: 'Bu işlem için yetkiniz yok'
      });
    }
    
    // Güncellenecek alanlar
    const updateData = { ...req.body };
    
    // Resim dosyalarını kontrol et
    if (req.files) {
      // Ana resim
      if (req.files.mainImage) {
        // Eski ana resmi sil
        if (property.mainImage && property.mainImage !== '/uploads/properties/default.jpg') {
          const oldImagePath = path.join(__dirname, '../../', property.mainImage);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        updateData.mainImage = `/uploads/properties/${req.files.mainImage[0].filename}`;
      }
      
      // Diğer resimler
      if (req.files.images) {
        // Eski resimleri sil
        if (property.images && property.images.length > 0) {
          property.images.forEach(img => {
            const oldImagePath = path.join(__dirname, '../../', img);
            if (fs.existsSync(oldImagePath)) {
              fs.unlinkSync(oldImagePath);
            }
          });
        }
        updateData.images = req.files.images.map(file => `/uploads/properties/${file.filename}`);
      }
    }
    
    // features JSON parse
    if (updateData.features) {
      updateData.features = JSON.parse(updateData.features);
    }
    
    // Boolean dönüşümleri
    if (updateData.isFeatured !== undefined) {
      updateData.isFeatured = updateData.isFeatured === 'true';
    }
    
    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );
    
    res.status(200).json({
      message: 'İlan başarıyla güncellendi',
      property: updatedProperty
    });
  } catch (error) {
    res.status(500).json({
      message: 'İlan güncellenemedi',
      error: error.message
    });
  }
};

// İlan sil
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({
        message: 'İlan bulunamadı'
      });
    }
    
    // Yetki kontrolü
    if (property.createdBy.toString() !== req.userId && !req.isAdmin) {
      return res.status(403).json({
        message: 'Bu işlem için yetkiniz yok'
      });
    }
    
    // Resimleri sil
    if (property.mainImage && property.mainImage !== '/uploads/properties/default.jpg') {
      const mainImagePath = path.join(__dirname, '../../', property.mainImage);
      if (fs.existsSync(mainImagePath)) {
        fs.unlinkSync(mainImagePath);
      }
    }
    
    if (property.images && property.images.length > 0) {
      property.images.forEach(img => {
        const imagePath = path.join(__dirname, '../../', img);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      });
    }
    
    await Property.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      message: 'İlan başarıyla silindi'
    });
  } catch (error) {
    res.status(500).json({
      message: 'İlan silinemedi',
      error: error.message
    });
  }
};

// Öne çıkan ilanları getir
exports.getFeaturedProperties = async (req, res) => {
  try {
    const properties = await Property.find({ isFeatured: true, status: 'active' })
      .limit(6)
      .populate('agent', 'name image title');
    
    res.status(200).json({
      properties
    });
  } catch (error) {
    res.status(500).json({
      message: 'Öne çıkan ilanlar alınamadı',
      error: error.message
    });
  }
};

// En son eklenen ilanları getir
exports.getLatestProperties = async (req, res) => {
  try {
    const properties = await Property.find({ status: 'active' })
      .sort('-createdAt')
      .limit(8)
      .populate('agent', 'name image title');
    
    res.status(200).json({
      properties
    });
  } catch (error) {
    res.status(500).json({
      message: 'Son eklenen ilanlar alınamadı',
      error: error.message
    });
  }
};