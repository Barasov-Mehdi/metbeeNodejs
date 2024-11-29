const express = require('express');
const router = express.Router();
const Feedback = require('../models/feedback');

// Geri bildirim formu sayfası
router.get('/', (req, res) => {
  const successMessage = req.query.success ? "Mesaj Gönderildi" : "";
  res.render('feedback', { successMessage });
});

// Geri bildirim gönderme
router.post('/', async (req, res) => {
  const { name, phone, email, message } = req.body;

  try {
    const feedback = new Feedback({ name, phone, email, message });
    await feedback.save();
    // Başarılı bir geri bildirimden sonra form sayfasına yönlendiriyoruz
    res.redirect('/feedback?success=true'); // Başarı mesajı için query parametre ekliyoruz
  } catch (error) {
    console.error('Error saving feedback:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;