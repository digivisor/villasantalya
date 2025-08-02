const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  discountedPrice: {
    type: Number,
  },
  location: {
    type: String,
    required: true,
  },
  fullAddress: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['Satılık', 'Kiralık'],
    required: true,
  },
  propertyType: {
    type: String,
    enum: ['Daire', 'Villa', 'Apartman', 'Dükkan', 'Ticari', 'Arazi', 'Dağ Evi'],
    required: true,
  },
  area: {
    type: Number,
    required: true,
  },
  beds: {
    type: Number,
  },
  baths: {
    type: Number,
  },
  images: [{
    type: String,
  }],
  mainImage: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
  },
  features: [{
    type: String,
  }],
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'pending', 'sold', 'rented'],
    default: 'active',
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  latitude: {
    type: Number,
  },
  longitude: {
    type: Number,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Property', PropertySchema);