const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const methodOverride = require('method-override'); // method-override modülünü ekleyin
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method')); // method-override'ı kullanın

// Middleware
app.use(cors());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// MongoDB Bağlantısı
const mongoURI = process.env.MONGODB_URI;
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB bağlantısı başarılı'))
  .catch((err) => console.error('MongoDB bağlantı hatası:', err));

// Routes
const serviceRoutes = require('./routes/serviceRoutes');
const feedbackRoutes = require('./routes/feedback');

app.use('/feedback', feedbackRoutes); 
app.use('/service', serviceRoutes); 

// Geri bildirimleri gösteren route
app.get('/feedbacks', async (req, res) => {
    try {
        const feedbacks = await Feedback.find(); // Veritabanından geri bildirimleri al
        res.render('feedbacks', { feedbacks });  // EJS'ye geri bildirimleri gönder
    } catch (error) {
        res.status(500).send('Bir hata oluştu.');
    }
});

// Feedback silme route
app.delete('/feedback/:id', async (req, res) => {
    try {
        await Feedback.findByIdAndDelete(req.params.id);
        res.redirect('/feedbacks');  // Silme işlemi sonrasında geri bildirimler sayfasına yönlendir
    } catch (error) {
        res.status(500).send('Bir hata oluştu.');
    }
});

// Basit bir örnek route
app.get('/', (req, res) => {
  res.send('Matbaa API çalışıyor!');
});

// Sunucuyu Başlat
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor.`);
});