  // src/controllers/property.controller.js
  const Property = require('../models/property.model');
  const User = require('../models/user.model');
  const { generateSlug } = require('../utils/helpers');
  const path = require('path');

    // Tüm onaylanmış ilanları getir (public)
  exports.getAllProperties = async (req, res) => {
    try {
      // Varsayılan olarak sadece onaylanmış ilanları getir
        const query = {}; // Boş filtre = tüm ilanlar

    
      if (req.query.propertyType) {
        query.propertyType = req.query.propertyType;
      }
      
      if (req.query.status) { // "sale" veya "rent"
        query.status = req.query.status;
      }
      
      if (req.query.minPrice && req.query.maxPrice) {
        query.price = { 
          $gte: Number(req.query.minPrice), 
          $lte: Number(req.query.maxPrice) 
        };
      } else if (req.query.minPrice) {
        query.price = { $gte: Number(req.query.minPrice) };
      } else if (req.query.maxPrice) {
        query.price = { $lte: Number(req.query.maxPrice) };
      }

      
      if (req.query.district) {
        query.district = { $regex: req.query.district, $options: 'i' };
      }
      
      if (req.query.city) {
        query.city = { $regex: req.query.city, $options: 'i' };
      }
      
      
      if (req.query.bathrooms) {
        query.bathrooms = { $gte: Number(req.query.bathrooms) };
      }
      
      if (req.query.minArea && req.query.maxArea) {
        query.area = { 
          $gte: Number(req.query.minArea), 
          $lte: Number(req.query.maxArea) 
        };
      } else if (req.query.minArea) {
        query.area = { $gte: Number(req.query.minArea) };
      } else if (req.query.maxArea) {
        query.area = { $lte: Number(req.query.maxArea) };
      }
      
      // Arama filtresi
      if (req.query.keyword) {
        query.$or = [
          { title: { $regex: req.query.keyword, $options: 'i' } },
          { description: { $regex: req.query.keyword, $options: 'i' } },
          { address: { $regex: req.query.keyword, $options: 'i' } },
          { district: { $regex: req.query.keyword, $options: 'i' } },
          { city: { $regex: req.query.keyword, $options: 'i' } }
        ];
      }
      
      // Sıralama seçenekleri
      let sort = {};
      if (req.query.sort) {
        switch (req.query.sort) {
          case 'price-asc':
            sort = { price: 1 };
            break;
          case 'price-desc':
            sort = { price: -1 };
            break;
          case 'newest':
            sort = { createdAt: -1 };
            break;
          case 'oldest':
            sort = { createdAt: 1 };
            break;
          default:
            sort = { createdAt: -1 }; // Varsayılan sıralama: en yeni
        }
      } else {
        sort = { createdAt: -1 }; // Varsayılan sıralama: en yeni
      }
      
      // Sayfalama için
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 100;
      const skip = (page - 1) * limit;
      
      // İlanları getir ve agent bilgilerini popüle et
      const properties = await Property.find(query)
        .populate('agent', 'name email phone image')
        .sort(sort)
        .skip(skip)
        .limit(limit);
      
      // Toplam ilan sayısı
      const totalCount = await Property.countDocuments(query);
      
      res.status(200).json({
        message: 'İlanlar başarıyla getirildi',
        properties,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit),
          totalItems: totalCount,
          itemsPerPage: limit
        }
      });
    } catch (error) {
      console.error('Error fetching properties:', error);
      res.status(500).json({
        message: 'İlanlar getirilirken bir hata oluştu',
        error: error.message
      });
    }
  };
  // İlan ekleme
  exports.createProperty = async (req, res) => {
    try {
      console.log('Create property request:', req.body);
      console.log('Files received:', req.files ? req.files.length : 'No files');
      
      // Kullanıcı kontrolü
      if (!req.userId) {
        return res.status(401).json({ message: 'Bu işlem için giriş yapmanız gerekmektedir' });
      }
      
      // Agent bilgisini al
      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
      }
      
      // req.body.data'yı parse et
      let propertyData;
      if (req.body.data) {
        try {
          propertyData = JSON.parse(req.body.data);
          console.log('Parsed property data:', propertyData);
          
          // Konum verisi kontrolü
          if (propertyData.location) {
            console.log('Location data:', propertyData.location);
          } else {
            console.warn('No location data found in the request');
          }
        } catch (e) {
          console.error('Error parsing data:', e);
          return res.status(400).json({ message: 'Geçersiz veri formatı' });
        }
      } else {
        propertyData = req.body;
      }
      
      // Resim dosyalarını işle
      let imagesPaths = [];
      let mainImagePath = '';
      
      if (req.files && req.files.length > 0) {
        console.log('Processing uploaded files:');
        req.files.forEach((file, index) => {
          console.log(`File ${index + 1}: ${file.originalname}, ${file.mimetype}, ${file.size} bytes, path: ${file.path}`);
          
          // Dosya yolunu göreceli hale getir
          const relativePath = `/uploads/properties/${path.basename(file.path)}`;
          imagesPaths.push(relativePath);
          
          if (index === 0) {
            mainImagePath = relativePath; // İlk dosyayı ana resim olarak ayarla
          }
        });
        console.log('Image paths:', imagesPaths);
        console.log('Main image path:', mainImagePath);
      } else {
        console.warn('No images uploaded');
      }
      
      // Slug oluştur
      const slug = generateSlug(propertyData.title);
      console.log('Generated slug:', slug);
      
      // Yeni ilan oluştur
      const newProperty = new Property({
        ...propertyData,
        slug,
        agent: req.userId,
        mainImage: mainImagePath,
        images: imagesPaths,
        status: 'pending',
        isApproved: false
      });
      


    
      if (propertyData.bathrooms) newProperty.bathrooms = Number(propertyData.bathrooms);
      if (propertyData.area) newProperty.area = Number(propertyData.area);
      if (propertyData.buildingAge) newProperty.buildingAge = Number(propertyData.buildingAge);
      if (propertyData.floor) newProperty.floor = Number(propertyData.floor);
      if (propertyData.totalFloors) newProperty.totalFloors = Number(propertyData.totalFloors);
      
      // Boolean alanları düzelt
      newProperty.furnished = propertyData.furnished === 'true' || propertyData.furnished === true;
      newProperty.balcony = propertyData.balcony === 'true' || propertyData.balcony === true;
      newProperty.parking = propertyData.parking === 'true' || propertyData.parking === true;
      newProperty.elevator = propertyData.elevator === 'true' || propertyData.elevator === true;
      newProperty.security = propertyData.security === 'true' || propertyData.security === true;
      newProperty.garden = propertyData.garden === 'true' || propertyData.garden === true;
      
      // İlanı kaydet
      await newProperty.save();
      console.log('Property saved successfully:', newProperty._id);
      
      res.status(201).json({
        message: 'İlan başarıyla eklendi. Onay için bekleyiniz.',
        property: newProperty
      });
    } catch (error) {
      console.error('Property creation error:', error);
      res.status(500).json({
        message: 'İlan eklenirken bir hata oluştu',
        error: error.message
      });
    }
  };
  // Danışmanın kendi ilanlarını listeleyen fonksiyon
  exports.getMyProperties = async (req, res) => {
    try {
      // Kullanıcı kontrolü
      if (!req.userId) {
        return res.status(401).json({ message: 'Bu işlem için giriş yapmanız gerekmektedir' });
      }
      
      const properties = await Property.find({ agent: req.userId })
        .sort({ createdAt: -1 });
      
      res.status(200).json({
        message: 'İlanlar başarıyla getirildi',
        properties
      });
    } catch (error) {
      res.status(500).json({
        message: 'İlanlar getirilirken bir hata oluştu',
        error: error.message
      });
    }
  };
  exports.getPropertyBySlug = async (req, res) => {
    try {
      const property = await Property.findOne({ slug: req.params.slug })
        .populate('agent', 'name email phone image');
      
      if (!property) {
        return res.status(404).json({ message: 'İlan bulunamadı' });
      }
      
      // Property'i JSON'a dönüştür
      const propertyObj = property.toObject();
      
      // Features ve nearbyPlaces dizilerini kontrol et ve ayrıştır
      if (propertyObj.features) {
        // Önce features'ın kendisinin bir dizi olup olmadığını kontrol et
        if (Array.isArray(propertyObj.features)) {
          // Dizinin içindeki her öğeyi kontrol et, string ise ayrıştırmayı dene
          propertyObj.features = propertyObj.features.map(item => {
            if (typeof item === 'string' && (item.startsWith('[') || item.startsWith('['))) {
              try {
                return JSON.parse(item);
              } catch (e) {
                console.error('Error parsing feature item:', e);
                return item;
              }
            }
            return item;
          }).flat(); // Nested dizileri düzleştir
        } 
        // Eğer features bir string ise, ayrıştırmayı dene
        else if (typeof propertyObj.features === 'string') {
          try {
            propertyObj.features = JSON.parse(propertyObj.features);
          } catch (e) {
            console.error('Error parsing features string:', e);
          }
        }
      }
      
      // Aynı işlemi nearbyPlaces için de yap
      if (propertyObj.nearbyPlaces) {
        if (Array.isArray(propertyObj.nearbyPlaces)) {
          propertyObj.nearbyPlaces = propertyObj.nearbyPlaces.map(item => {
            if (typeof item === 'string' && (item.startsWith('[') || item.startsWith('['))) {
              try {
                return JSON.parse(item);
              } catch (e) {
                console.error('Error parsing nearbyPlace item:', e);
                return item;
              }
            }
            return item;
          }).flat();
        } else if (typeof propertyObj.nearbyPlaces === 'string') {
          try {
            propertyObj.nearbyPlaces = JSON.parse(propertyObj.nearbyPlaces);
          } catch (e) {
            console.error('Error parsing nearbyPlaces string:', e);
          }
        }
      }
      
      // Benzer ilanları da getir
      const relatedProperties = await Property.find({
        _id: { $ne: property._id },
        propertyType: property.propertyType,
        // isApproved: true
      })
      .limit(3)
      .populate('agent', 'name email phone image')
      .lean();
      
      // Benzer ilanlarda da özellikleri ayrıştır
      relatedProperties.forEach(relatedProperty => {
        if (relatedProperty.features) {
          if (Array.isArray(relatedProperty.features)) {
            relatedProperty.features = relatedProperty.features.map(item => {
              if (typeof item === 'string' && (item.startsWith('[') || item.startsWith('['))) {
                try {
                  return JSON.parse(item);
                } catch (e) {
                  console.error('Error parsing related feature item:', e);
                  return item;
                }
              }
              return item;
            }).flat();
          } else if (typeof relatedProperty.features === 'string') {
            try {
              relatedProperty.features = JSON.parse(relatedProperty.features);
            } catch (e) {
              console.error('Error parsing related features string:', e);
            }
          }
        }
      });
      
      res.status(200).json({
        message: 'İlan başarıyla getirildi',
        property: propertyObj,
        relatedProperties
      });
    } catch (error) {
      console.error('Error fetching property by slug:', error);
      res.status(500).json({
        message: 'İlan getirilirken bir hata oluştu',
        error: error.message
      });
    }
  };
  // İlan detayını getiren fonksiyon
  exports.getPropertyById = async (req, res) => {
    try {
      const property = await Property.findById(req.params.id)
        .populate('agent', 'name email phone image');
      
      if (!property) {
        return res.status(404).json({ message: 'İlan bulunamadı' });
      }
      
      res.status(200).json({
        message: 'İlan başarıyla getirildi',
        property
      });
    } catch (error) {
      res.status(500).json({
        message: 'İlan getirilirken bir hata oluştu',
        error: error.message
      });
    }
  };

  // İlan güncelleme
  exports.updateProperty = async (req, res) => {
    try {
      // Kullanıcı kontrolü
      if (!req.userId) {
        return res.status(401).json({ message: 'Bu işlem için giriş yapmanız gerekmektedir' });
      }
      if (req.body.title) {
        req.body.slug = generateSlug(req.body.title);
      }
      // İlanı bul
      const property = await Property.findById(req.params.id);
      
      if (!property) {
        return res.status(404).json({ message: 'İlan bulunamadı' });
      }
      
      // İlanın sahibi mi kontrol et
      if (property.agent.toString() !== req.userId && !req.isAdmin) {
        return res.status(403).json({ message: 'Bu işlem için yetkiniz bulunmamaktadır' });
      }
      
      // Resim dosyalarını işle
      let imagesPaths = property.images || [];
      let mainImagePath = property.mainImage;
      
      if (req.files && req.files.length > 0) {
        const newImagePaths = req.files.map(file => `/uploads/properties/${file.filename}`);
        imagesPaths = [...imagesPaths, ...newImagePaths];
        if (!mainImagePath && newImagePaths.length > 0) {
          mainImagePath = newImagePaths[0];
        }
      }
      
      // İlanı güncelle
      const updatedData = {
        ...req.body,
        images: imagesPaths,
        mainImage: mainImagePath,
        status: req.isAdmin ? req.body.status : 'pending', // Admin değilse, güncellemeler onay bekler
        isApproved: req.isAdmin ? req.body.isApproved : false
      };
      
      // Sayısal alanları düzelt
      // if (req.body.price) updatedData.price = Number(req.body.price);
      // if (req.body.bedrooms) updatedData.bedrooms = Number(req.body.bedrooms);
      if (req.body.bathrooms) updatedData.bathrooms = Number(req.body.bathrooms);
      if (req.body.area) updatedData.area = Number(req.body.area);
      if (req.body.buildingAge) updatedData.buildingAge = Number(req.body.buildingAge);
      
      // Boolean alanları düzelt
      if (req.body.furnished !== undefined) updatedData.furnished = req.body.furnished === 'true' || req.body.furnished === true;
      if (req.body.balcony !== undefined) updatedData.balcony = req.body.balcony === 'true' || req.body.balcony === true;
      if (req.body.parking !== undefined) updatedData.parking = req.body.parking === 'true' || req.body.parking === true;
      if (req.body.elevator !== undefined) updatedData.elevator = req.body.elevator === 'true' || req.body.elevator === true;
      if (req.body.security !== undefined) updatedData.security = req.body.security === 'true' || req.body.security === true;
      if (req.body.garden !== undefined) updatedData.garden = req.body.garden === 'true' || req.body.garden === true;
      if (req.body.featured !== undefined) updatedData.featured = req.body.featured === 'true' || req.body.featured === true;

      
      
      const updatedProperty = await Property.findByIdAndUpdate(
        req.params.id,
        updatedData,
        { new: true }
      );
      
      res.status(200).json({
        message: req.isAdmin ? 'İlan başarıyla güncellendi' : 'İlan güncellendi. Onay için bekleyiniz.',
        property: updatedProperty
      });
    } catch (error) {
      res.status(500).json({
        message: 'İlan güncellenirken bir hata oluştu',
        error: error.message
      });
    }
  };

  // İlan silme
  exports.deleteProperty = async (req, res) => {
    try {
      // Kullanıcı kontrolü
      if (!req.userId) {
        return res.status(401).json({ message: 'Bu işlem için giriş yapmanız gerekmektedir' });
      }
      
      // İlanı bul
      const property = await Property.findById(req.params.id);
      
      if (!property) {
        return res.status(404).json({ message: 'İlan bulunamadı' });
      }
      
      // İlanın sahibi mi veya admin mi kontrol et
      if (property.agent.toString() !== req.userId && !req.isAdmin) {
        return res.status(403).json({ message: 'Bu işlem için yetkiniz bulunmamaktadır' });
      }
      
      await Property.findByIdAndDelete(req.params.id);
      
      res.status(200).json({
        message: 'İlan başarıyla silindi'
      });
    } catch (error) {
      res.status(500).json({
        message: 'İlan silinirken bir hata oluştu',
        error: error.message
      });
    }
  };

exports.getPendingProperties = async (req, res) => {
  try {
    console.log('===== GET PENDING PROPERTIES =====');
    console.log('User ID:', req.userId);
    console.log('Is Admin:', req.isAdmin);
    
    try {
      // 1. Tüm property'leri say
      const totalCount = await Property.countDocuments({});
      console.log('Total properties:', totalCount);
      
      // 2. Status alanına göre property'leri say
      const pendingCount = await Property.countDocuments({ status: 'pending' });
      console.log('Pending properties count:', pendingCount);
      
      // 3. İlk 5 property'i getir
      const sampleProps = await Property.find({}).limit(5).lean();
      console.log('Sample property _id type:', typeof sampleProps[0]?._id);
      console.log('Sample property schema:', Object.keys(sampleProps[0] || {}));
      
      // 4. Pending property'leri getir
      const pendingProperties = await Property.find({ status: 'pending' }).lean();
      console.log(`Successfully found ${pendingProperties.length} pending properties`);
      
      // 5. Agent bilgilerini getir ve manual olarak popüle et
      const agentIds = pendingProperties
        .map(p => p.agent)
        .filter(id => id); // Undefined olanları filtrele
      
      console.log('Agent IDs:', agentIds);
      
      const agents = await User.find({ _id: { $in: agentIds } }).lean();
      console.log(`Found ${agents.length} agents`);
      
      // Agent map'i oluştur
      const agentMap = {};
      agents.forEach(agent => {
        agentMap[agent._id.toString()] = {
          _id: agent._id,
          name: agent.name,
          email: agent.email,
          phone: agent.phone,
          image: agent.image
        };
      });
      
      // Property'lere agent bilgilerini ekle
      const populatedProperties = pendingProperties.map(property => {
        if (property.agent && agentMap[property.agent.toString()]) {
          return {
            ...property,
            agent: agentMap[property.agent.toString()]
          };
        }
        return property;
      });
      
      // Sonucu döndür
      return res.status(200).json({
        message: 'Onay bekleyen ilanlar başarıyla getirildi',
        properties: populatedProperties
      });
    } catch (dbError) {
      console.error('Database operation error:', dbError);
      console.error('Error stack:', dbError.stack);
      throw dbError;
    }
  } catch (error) {
    console.error('Error in getPendingProperties:', error);
    console.error('Error stack:', error.stack);
    return res.status(500).json({
      message: 'İlanlar getirilirken bir hata oluştu',
      error: error.message
    });
  }
};

  // Admin için ilan onaylama
  exports.approveProperty = async (req, res) => {
    try {
      // Admin kontrolü
      if (!req.isAdmin) {
        return res.status(403).json({ message: 'Bu işlem için yetkiniz bulunmamaktadır' });
      }
      
      const property = await Property.findById(req.params.id);
      
      if (!property) {
        return res.status(404).json({ message: 'İlan bulunamadı' });
      }
      
      property.status = 'active';
      property.isApproved = true;
      
      await property.save();
      
      res.status(200).json({
        message: 'İlan başarıyla onaylandı',
        property
      });
    } catch (error) {
      res.status(500).json({
        message: 'İlan onaylanırken bir hata oluştu',
        error: error.message
      });
    }
  };

  // Admin için ilan reddetme
  exports.rejectProperty = async (req, res) => {
    try {
      // Admin kontrolü
      if (!req.isAdmin) {
        return res.status(403).json({ message: 'Bu işlem için yetkiniz bulunmamaktadır' });
      }
      
      const property = await Property.findById(req.params.id);
      
      if (!property) {
        return res.status(404).json({ message: 'İlan bulunamadı' });
      }
      
      property.status = 'rejected';
      property.isApproved = false;
      property.rejectionReason = req.body.reason;
      
      await property.save();
      
      res.status(200).json({
        message: 'İlan reddedildi',
        property
      });
    } catch (error) {
      res.status(500).json({
        message: 'İlan reddedilirken bir hata oluştu',
        error: error.message
      });
    }

  };