const mongoose = require('mongoose');
const express = require('express');

const serviceSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ['Vergi xidməti', 'Mühasibat xidməti', 'Mətbəə və poliqrafiya', 'Boşdur'],
    required: true
  },
  image: {
    type: String, // Resmin URL'sini tutmak için
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  info: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now // Yeni bir hizmet eklendiğinde otomatik olarak mevcut tarih ayarları
  }
});

module.exports = mongoose.model('Service', serviceSchema);
