const mongoose = require('mongoose');
const { generateSlug } = require('../utils/helpers');
const { strict } = require('assert');

// Schema tanımlaması
const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    trim: true
  },

  price: {
    type: String,
    required: true
  },
  discountedPrice: {
    type: Number
  },
  description: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  district: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
    },
    coordinates: {
      type: [Number]
    }
  },
  status: {
    type: String,
    enum: ['active', 'pending', 'rejected', 'sold', 'rented'],
    default: 'pending'  // Her zaman pending olarak başlayacak
  },
  type: {
    type: String,
    enum: ['sale', 'rent'],
    required: true  // Bu alan zorunlu olmalı
  },
  propertyType: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  area: {
    type: Number,
    required: true
  },
  bedrooms: {
  type: String, 
  default: "" // Varsayılan değeri boş string
},
  bathrooms: {
    type: Number,
    default: 0
  },
  buildingAge: {
    type: Number
  },
  furnished: {
    type: Boolean,
    default: false
  },
    featured: {
    type: Boolean,
    default: false
  },
  balcony: {
    type: Boolean,
    default: false
  },
  parking: {
    type: Boolean,
    default: false
  },
  elevator: {
    type: Boolean,
    default: false
  },
  security: {
    type: Boolean,
    default: false
  },
  garden: {
    type: Boolean,
    default: false
  },
 location: {
    lat: {
      type: String,
      default: ''
    },
    lng: {
      type: String,
      default: ''
    }
  },
    currency: {
    type: String,
    enum: ['TRY', 'USD', 'EUR'],
    default: 'TRY'
  },
  images: {
    type: [String],
    default: []
  },
  mainImage: {
    type: String,
    default: ''
  },
  features: {
    type: [String],
    default: []
  },
  nearbyPlaces: {
    type: [String],
    default: []
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  rejectionReason: {
    type: String
  },
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  discountedPrice:{
    type: String,
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, 
{ strict: false, // Sadece tanımlanan alanlara izin ver
  timestamps: true
});
// Slug oluşturmak için pre-save hook
propertySchema.pre('save', function(next) {
  // Eğer slug yoksa ve başlık varsa, slug oluştur
  if (!this.slug && this.title) {
    this.slug = generateSlug(this.title);
  }
  next();
});

// Aramalarda geospatial index kullan
propertySchema.index({ location: '2dsphere' });

const Property = mongoose.model('Property', propertySchema);
module.exports = Property;