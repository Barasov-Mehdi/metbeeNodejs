const express = require('express');
const router = express.Router();
const Service = require('../models/service');

// Tüm hizmetleri getir
router.get('/getAll', async (req, res) => {
  try {
    const services = await Service.find(); // Veritabanından tüm hizmetleri al
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: 'Hizmetleri alırken hata oluştu', error: error.message });
  }
});


router.get('/add', (req, res) => {
  res.render('add'); // 'add' ejs dosyasını render ediyor
});

// Yeni hizmet ekle
router.post('/add', async (req, res) => {
  try {
    const { category, image, name, description } = req.body;

    // Gerekli alanların kontrolü
    if (!category || !image || !name || !description) {
      return res.status(400).json({ message: 'Lütfen tüm alanları doldurun.' });
    }

    // Yeni hizmet oluşturma
    const newService = new Service({
      category,
      image,
      name,
      description
    });

    // Veritabanına kaydetme
    await newService.save();
    res.status(201).json({ message: 'Hizmet başarıyla eklendi.', service: newService });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
});

module.exports = router;
