const express = require('express');
const Feedback = require('../models/feedback');

const router = express.Router();

// Geri bildirim ekleme
router.post('/', async (req, res) => {
  try {
    const feedback = new Feedback(req.body);
    await feedback.save();
    res.status(201).send({ message: 'Geri bildirim alındı!', feedback });
  } catch (error) {
    res.status(400).send({ error: 'Geri bildirim eklenemedi!', details: error.message });
  }
});

// Tüm geri bildirimleri getirme
router.get('/', async (req, res) => {
  try {
    const feedbacks = await Feedback.find();
    res.status(200).send(feedbacks);
  } catch (error) {
    res.status(500).send({ error: 'Geri bildirimler getirilirken hata oluştu!', details: error.message });
  }
});

module.exports = router;