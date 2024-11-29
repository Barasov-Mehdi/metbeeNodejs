// app.js içeriği (önceki kısım değişmeden kalacak)
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
const feedbackRoutes = require('./routes/feedback'); // Geri bildirim yollarını ekleyin

app.use('/feedback', feedbackRoutes); // Geri bildirim rotasını ekleyin
app.use('/service', serviceRoutes); // '/service' rotasına yönlendirme

// Basit bir örnek route
app.get('/', (req, res) => {
  res.send('Matbaa API çalışıyor!');
});

// Sunucuyu Başlat
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor.`);
});