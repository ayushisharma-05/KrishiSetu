const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
    sparse: true, 
  },
  password: {
    type: String,
  },
  full_name: {
    type: String,
  },
  state: {
    type: String,
  },
  district: {
    type: String,
  },
  land_size: {
    type: Number,
  },
  soil_type: {
    type: String,
  },
  whatsapp_opt_in: {
    type: Boolean,
    default: true,
  },
  preferred_lang: {
    type: String,
    default: 'en',
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
