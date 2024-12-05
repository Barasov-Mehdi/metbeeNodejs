// serviceRoutes.js
const express = require('express');
const router = express.Router();
const Service = require('../models/service');
const cloudinary = require('../config/cloudinary'); // Cloudinary konfigürasyonunu içe aktar
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  folder: 'uploads', // Bulutta depolanacak klasör adı
  allowedFormats: ['jpg', 'png', 'jpeg']
});

const parser = multer({ storage: storage });

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
router.post('/add', parser.single('image'), async (req, res) => {
  try {
    const { category, name, description, info } = req.body;

    if (!category || !req.file || !name || !description || !info) {
      return res.status(400).json({ message: 'Lütfen tüm alanları doldurun.' });
    }

    const newService = new Service({
      category,
      image: req.file.path, // Cloudinary'den dönen URL
      name,
      description,
      info
    });

    await newService.save();
    res.redirect('/service/add'); // Yönlendirme
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
});

router.get('/remove', async (req, res) => {
  try {
    const services = await Service.find(); // Veritabanından tüm hizmetleri al
    console.log(services); // Hizmetleri kontrol edin
    res.render('remove', { services }); // 'remove' ejs dosyasını render ediyor
  } catch (error) {
    console.error(error); // Hata alırsanız yazdırın
    res.status(500).json({ message: 'Hizmetleri alırken hata oluştu', error: error.message });
  }
});

// Silmek için POST isteği
router.post('/remove', async (req, res) => {
  try {
    const { serviceId } = req.body;

    // Hizmeti sil
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Hizmet bulunamadı' });
    }

    // Cloudinary'den resmi sil (opsiyonel)
    const imagePublicId = service.image.split('/').pop().split('.')[0]; // Resim URL'sindeki public ID'yi çıkar
    await cloudinary.uploader.destroy(imagePublicId); // Resmi Cloudinary'den sil

    await Service.findByIdAndDelete(serviceId);
    // res.status(200).json({ message: 'Hizmet başarıyla silindi' });
    res.redirect('/service/remove'); // Yönlendirme
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
});

// Belirli bir hizmeti sil
router.delete('/remove/:id', async (req, res) => {
  try {
    const serviceId = req.params.id;
    const service = await Service.findById(serviceId);

    if (!service) {
      return res.status(404).json({ message: 'Hizmet bulunamadı' });
    }

    // Cloudinary'den resmi sil (opsiyonel)
    const imagePublicId = service.image.split('/').pop().split('.')[0]; // Resim URL'sindeki public ID'yi çıkar
    await cloudinary.uploader.destroy(imagePublicId); // Resmi Cloudinary'den sil

    await Service.findByIdAndDelete(serviceId);
    // res.status(200).json({ message: 'Hizmet başarıyla silindi' });
    res.redirect('/service/remove'); // Yönlendirme
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
});

module.exports = router;