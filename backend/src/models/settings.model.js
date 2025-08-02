// src/models/settings.model.js
const mongoose = require('mongoose');

/**
 * Settings Schema
 * Site ayarları için şema tanımı
 */
const SettingsSchema = new mongoose.Schema({
  siteTitle: {
    type: String,
    default: 'Villas Antalya',
  },
  siteDescription: {
    type: String,
    default: 'Antalya\'nın en prestijli emlak sitesi',
  },
  contactEmail: {
    type: String,
  },
  contactPhone: {
    type: String,
  },
  address: {
    type: String,
  },
  socialLinks: {
    facebook: String,
    twitter: String,
    instagram: String,
    youtube: String,
    linkedin: String,
  },
  logoImage: {
    type: String,
  },
  faviconImage: {
    type: String,
  },
  youtubeVideoId: {
    type: String,
    default: 'dQw4w9WgXcQ',
  },
  aboutPageContent: {
    type: String,
  },
  privacyPolicyContent: {
    type: String,
  },
  termsContent: {
    type: String,
  },
  headerScript: {
    type: String,
    default: '',
  },
  footerScript: {
    type: String,
    default: '',
  },
  metaTags: {
    type: String,
    default: '',
  },
  currencies: [{
    code: String,
    symbol: String,
    rate: Number,
    isDefault: {
      type: Boolean,
      default: false
    }
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, { 
  timestamps: true 
});

/**
 * Singleton pattern - Sadece bir ayar dokümanı olmasını sağlamak için
 * Bu metod ile her zaman aynı ayar nesnesi döner, yoksa oluşturulur
 */
SettingsSchema.statics.getInstance = async function() {
  const settings = await this.findOne();
  if (settings) {
    return settings;
  }
  
  return await this.create({
    siteTitle: 'Villas Antalya',
    siteDescription: 'Antalya\'nın en prestijli emlak sitesi',
    contactEmail: 'info@villasantalya.com',
    contactPhone: '+90 555 123 4567',
    address: 'Lara, Antalya, Türkiye',
    socialLinks: {
      facebook: 'https://facebook.com/villasantalya',
      twitter: 'https://twitter.com/villasantalya',
      instagram: 'https://instagram.com/villasantalya'
    },
    currencies: [
      {
        code: 'TRY',
        symbol: '₺',
        rate: 1,
        isDefault: true
      },
      {
        code: 'USD',
        symbol: '$',
        rate: 0.034,
        isDefault: false
      },
      {
        code: 'EUR',
        symbol: '€',
        rate: 0.031,
        isDefault: false
      }
    ]
  });
};

/**
 * Ayarları güncelle ve son güncelleme tarihini otomatik olarak ayarla
 */
SettingsSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

module.exports = mongoose.model('Settings', SettingsSchema);