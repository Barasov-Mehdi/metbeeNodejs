const express = require('express'); // 'express'ı sadece bir kez tanımlayın
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express(); // Burada app'i tanımlayın

app.use(express.json()); // JSON verisini parse etmek için
app.use(express.urlencoded({ extended: true })); // Form verisini parse etmek için

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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