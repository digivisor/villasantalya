const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  logo: {
    type: String,
  },
  description: {
    type: String,
  },
  address: {
    type: String,
  },
  phone: {
    type: String,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
  },
  website: {
    type: String,
  },
  social: {
    facebook: String,
    twitter: String,
    instagram: String,
    linkedin: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Company', CompanySchema);