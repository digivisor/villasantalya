const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  siteTitle: {
    type: String,
    default: 'Villas Antalya'
  },
  siteDescription: {
    type: String,
    default: 'Antalya\'nın en prestijli emlak sitesi'
  },
  contactEmail: {
    type: String
  },
  contactPhone: {
    type: String
  },
  address: {
    type: String
  },
  socialLinks: {
    facebook: String,
    twitter: String,
    instagram: String,
    youtube: String,
    linkedin: String
  },
  youtubeVideoId: {
    type: String,
    default: 'dQw4w9WgXcQ'
  },
  logoImage: {
    type: String
  },
  faviconImage: {
    type: String
  },
  aboutPageContent: {
    type: String
  },
  privacyPolicyContent: {
    type: String
  },
  termsContent: {
    type: String
  },
  headerScript: {
    type: String,
    default: ''
  },
  footerScript: {
    type: String,
    default: ''
  },
  metaTags: {
    type: String,
    default: ''
  },
    workingHours: {
    weekday: {
      start: { type: String, default: '09:00' },
      end: { type: String, default: '18:00' }
    },
    saturday: {
      start: { type: String, default: '10:00' },
      end: { type: String, default: '14:00' }
    },
    sunday: {
      isOpen: { type: Boolean, default: false },
      start: { type: String, default: '00:00' },
      end: { type: String, default: '00:00' }
    }
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

// Singleton pattern
SettingsSchema.statics.getInstance = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({
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
        { code: 'TRY', symbol: '₺', rate: 1, isDefault: true },
        { code: 'USD', symbol: '$', rate: 0.034, isDefault: false },
        { code: 'EUR', symbol: '€', rate: 0.031, isDefault: false }
      ],
      youtubeVideoId: 'dQw4w9WgXcQ'
    });
  }
  return settings;
};

SettingsSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

module.exports = mongoose.model('Settings', SettingsSchema);
