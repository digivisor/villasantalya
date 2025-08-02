// src/utils/seeder.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const Company = require('../models/company.model');
const Property = require('../models/property.model');
const Settings = require('../models/settings.model');
require('dotenv').config();

// MongoDB'ye bağlan
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB for seeding');
    seed();
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Seed fonksiyonu
const seed = async () => {
  try {
    // Tüm koleksiyonları temizle
    await User.deleteMany({});
    await Company.deleteMany({});
    await Property.deleteMany({});
    await Settings.deleteMany({});
    
    console.log('All collections cleared');
    
    // Varsayılan şirketi oluştur
    const company = await Company.create({
      name: 'Villas Antalya',
      logo: '/uploads/companies/default-logo.jpg',
      description: 'Antalya\'nın en prestijli emlak şirketi',
      address: 'Lara Caddesi, No: 123, Antalya',
      phone: '+90 555 123 4567',
      email: 'info@villasantalya.com',
      website: 'https://villasantalya.com',
      social: {
        facebook: 'https://facebook.com/villasantalya',
        twitter: 'https://twitter.com/villasantalya',
        instagram: 'https://instagram.com/villasantalya',
        linkedin: 'https://linkedin.com/company/villasantalya'
      },
      isActive: true
    });
    
    console.log('Default company created');
    
    // Şifreleri manuel olarak hashleyelim
    const SALT_ROUNDS = 10;
    const adminPassword = 'admin123';
    const consultantPassword = 'consultant123';
    
    // Sabit salt kullanarak tutarlı hashleme yapalım
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const adminHashedPassword = await bcrypt.hash(adminPassword, salt);
    const consultantHashedPassword = await bcrypt.hash(consultantPassword, salt);
    
    // Şifre doğrulama testi
    const verifyAdminPassword = await bcrypt.compare(adminPassword, adminHashedPassword);
    console.log(`Admin password verification test: ${verifyAdminPassword ? 'Success ✓' : 'Failed ✗'}`);
    
    const verifyConsultantPassword = await bcrypt.compare(consultantPassword, consultantHashedPassword);
    console.log(`Consultant password verification test: ${verifyConsultantPassword ? 'Success ✓' : 'Failed ✗'}`);
    
    // Admin kullanıcısı oluştur
    const admin = await User.create({
      username: 'admin',
      email: 'admin@villasantalya.com',
      password: adminHashedPassword, // Pre-hashed password
      name: 'Admin User',
      title: 'Site Yöneticisi',
      phone: '+90 555 123 4567',
      image: '/uploads/agents/default-agent.jpg',
      company: company._id,
      isAdmin: true,
      isActive: true
    });
    
    console.log('Admin user created');
    console.log('Admin credentials: admin / admin123');
    
    // Örnek danışman oluştur
    const agent = await User.create({
      username: 'fazilcanakbas',
      email: 'fazilcan@villasantalya.com',
      password: consultantHashedPassword, // Pre-hashed password
      name: 'Fazıl Can Akbaş',
      title: 'Emlak Danışmanı',
      phone: '+90 551 389 52 55',
      image: '/uploads/agents/default-agent.jpg',
      about: 'Antalya bölgesinde 5 yıllık emlak deneyimine sahibim. Lüks villalar konusunda uzmanım.',
      company: company._id,
      rating: 4.8,
      experience: 5,
      languages: ['Türkçe', 'İngilizce'],
      regions: ['Lara', 'Muratpaşa', 'Konyaaltı'],
      specialties: ['Lüks Villalar', 'Deniz Manzaralı Daireler'],
      social: {
        facebook: 'https://facebook.com/fazilcanakbas',
        twitter: 'https://twitter.com/fazilcanakbas',
        instagram: 'https://instagram.com/fazilcanakbas',
        linkedin: 'https://linkedin.com/in/fazilcanakbas'
      },
      isAdmin: false,
      isActive: true
    });
    
    console.log('Consultant user created');
    console.log('Consultant credentials: fazilcanakbas / consultant123');
    
    // MongoDB kaydedilen kullanıcıları kontrol edelim
    const adminUser = await User.findOne({ username: 'admin' });
    const consultantUser = await User.findOne({ username: 'fazilcanakbas' });
    
    // Şifre doğrulama testleri
    if (adminUser) {
      const adminPwdCheck = await bcrypt.compare(adminPassword, adminUser.password);
      console.log(`Final admin password check: ${adminPwdCheck ? 'Success ✓' : 'Failed ✗'}`);
    }
    
    if (consultantUser) {
      const consultantPwdCheck = await bcrypt.compare(consultantPassword, consultantUser.password);
      console.log(`Final consultant password check: ${consultantPwdCheck ? 'Success ✓' : 'Failed ✗'}`);
    }
    
    // Örnek ilanlar oluştur
    const property1 = await Property.create({
      title: 'Lara\'da Deniz Manzaralı Lüks Villa',
      description: 'Antalya Lara\'da deniz manzaralı, özel havuzlu 5+2 lüks villa. Muhteşem konumu ile sizleri bekliyor.',
      price: 1500000,
      discountedPrice: 1400000,
      location: 'Lara',
      fullAddress: 'Güzeloba Mahallesi, Lara Caddesi, No: 123, Antalya',
      type: 'Satılık',
      propertyType: 'Villa',
      area: 350,
      beds: 5,
      baths: 3,
      mainImage: '/uploads/properties/default.jpg',
      images: ['/uploads/properties/default.jpg'],
      tag: 'Öne Çıkan',
      features: ['Özel Havuz', 'Deniz Manzarası', 'Güvenlikli Site', 'Akıllı Ev Sistemleri'],
      agent: agent._id,
      status: 'active',
      isFeatured: true,
      latitude: 36.8969,
      longitude: 30.7133,
      createdBy: agent._id
    });
    
    const property2 = await Property.create({
      title: 'Konyaaltı\'nda Site İçinde Modern Daire',
      description: 'Konyaaltı sahiline 5 dakika mesafede, site içerisinde, 3+1 modern daire. Açık havuz ve sosyal tesisler mevcut.',
      price: 800000,
      location: 'Konyaaltı',
      fullAddress: 'Liman Mahallesi, Boğaçayı Caddesi, No: 45, Antalya',
      type: 'Satılık',
      propertyType: 'Daire',
      area: 150,
      beds: 3,
      baths: 2,
      mainImage: '/uploads/properties/default.jpg',
      images: ['/uploads/properties/default.jpg'],
      features: ['Site İçi', 'Havuzlu', 'Spor Salonu', 'Otopark'],
      agent: agent._id,
      status: 'active',
      isFeatured: true,
      latitude: 36.8567,
      longitude: 30.6381,
      createdBy: agent._id
    });
    
    console.log('Example properties created');
    
    // Varsayılan site ayarları oluştur
    await Settings.create({
      siteTitle: 'Villas Antalya',
      siteDescription: 'Antalya\'nın en prestijli emlak sitesi',
      contactEmail: 'info@villasantalya.com',
      contactPhone: '+90 551 389 52 55',
      address: 'Lara Caddesi, No: 123, Antalya',
      socialLinks: {
        facebook: 'https://facebook.com/villasantalya',
        twitter: 'https://twitter.com/villasantalya',
        instagram: 'https://instagram.com/villasantalya',
        youtube: 'https://youtube.com/villasantalya',
        linkedin: 'https://linkedin.com/company/villasantalya'
      },
      youtubeVideoId: 'dQw4w9WgXcQ',
      aboutPageContent: 'Villas Antalya, Antalya\'nın önde gelen emlak firmalarından biridir. 10 yıllık deneyimimizle müşterilerimize en iyi hizmeti sunuyoruz.'
    });
    
    console.log('Default settings created');
    
    console.log('Database seeding completed successfully');
    console.log('=================================');
    console.log('LOGIN CREDENTIALS:');
    console.log('Admin: admin / admin123');
    console.log('Consultant: fazilcanakbas / consultant123');
    console.log('=================================');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};