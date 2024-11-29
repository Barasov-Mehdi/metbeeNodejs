// routes/newsRoutes.js

const express = require('express');
const News = require('../models/newsModel');
const router = express.Router();

// Haber ekleme sayfası
router.get('/add', (req, res) => {
    res.render('addNews');
});

// API ile haberleri döndüren bölüm
router.get('/api', async (req, res) => {
    const news = await News.find();
    res.json(news);
});

// Haber ekleme işlemi
router.post('/add', async (req, res) => {
    const { title, content, author } = req.body;

    const news = new News({ title, content, author });
    await news.save();
    res.redirect('/news'); // Haberi ekledikten sonra listeye yönlendir
});

// Haber silme işlemi
router.delete('/:id', async (req, res) => {
    await News.findByIdAndDelete(req.params.id);
    res.redirect('/news'); // Haberi sildikten sonra listeye yönlendir
});

// Tüm haberleri listeleme
router.get('/', async (req, res) => {
    const news = await News.find();
    res.render('newsList', { news });
});

module.exports = router;