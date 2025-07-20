require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const User = require('./models/User');
const Film = require('./models/Film');
const filmRobotuRoute = require('./routes/filmRobotu');
const filmsRoute = require('./routes/films');
const userRoute = require('./routes/user');
const redis = require('redis');
const amqp = require('amqplib');

// MongoDB bağlantısı
if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable tanımlı değil!');
}
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB bağlantısı başarılı!'))
  .catch((err) => console.error('MongoDB bağlantı hatası:', err));

// Redis bağlantısı
if (!process.env.REDIS_URL) {
  throw new Error('REDIS_URL environment variable tanımlı değil!');
}
const redisClient = redis.createClient({ url: process.env.REDIS_URL });
redisClient.on('error', (err) => console.error('Redis bağlantı hatası:', err));
redisClient.connect().then(() => console.log('Redis bağlantısı başarılı!'));

// RabbitMQ bağlantısı
let rabbitChannel = null;
async function connectRabbitMQ() {
  try {
    if (!process.env.RABBITMQ_URL) {
      throw new Error('RABBITMQ_URL environment variable tanımlı değil!');
    }
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    rabbitChannel = await connection.createChannel();
    await rabbitChannel.assertQueue('film_events');
    console.log('RabbitMQ bağlantısı başarılı!');
  } catch (err) {
    console.error('RabbitMQ bağlantı hatası:', err);
  }
}
connectRabbitMQ();


const app = express();
const PORT = 8080;

// CORS ayarları
app.use(cors({
  origin: true, // Tüm origin'lere izin ver
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(bodyParser.json());
app.use('/film-robotu', filmRobotuRoute);
app.use('/films', filmsRoute);
app.use('/user', userRoute);

app.get('/', (req, res) => {
  res.send('Backend çalışıyor!');
});

// Kayıt (register) endpoint'i
app.post('/register', async (req, res) => {
  try {
    console.log('Gelen veri:', req.body); // Terminalde görmek için
    const { name, email, password, passwordConfirm } = req.body;

    // Alan kontrolü
    if (!name || !email || !password || !passwordConfirm) {
      return res.status(400).json({ message: 'Tüm alanları doldurun', type: 'error' });
    }
    if (password !== passwordConfirm) {
      return res.status(400).json({ message: 'Şifreler uyuşmuyor', type: 'error' });
    }

    // Email daha önce kullanılmış mı?
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Bu email zaten kayıtlı', type: 'error' });
    }

    // Şifreyi direkt kaydet (hash yok)
    const newUser = new User({
      name,
      email,
      password
    });

    await newUser.save();
    console.log('Kullanıcı kaydedildi:', newUser); // Terminalde görmek için
    res.json({ message: 'Kayıt başarılı', type: 'success' });
  } catch (err) {
    console.error('Kayıt hatası:', err); // Terminalde görmek için
    res.status(500).json({ message: 'Veritabanı hatası', type: 'error' });
  }
});

// Login endpoint'i
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email ve şifre zorunlu', type: 'error' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Kullanıcı bulunamadı', type: 'error' });
    }
    if (user.password !== password) {
      return res.status(401).json({ message: 'Şifre yanlış', type: 'error' });
    }
    // Giriş başarılı, kullanıcı bilgilerini dönebiliriz
    res.json({
      message: 'Giriş başarılı',
      type: 'success',
      user: {
        name: user.name,
        email: user.email,
        joinDate: user._id.getTimestamp().getFullYear(),
      }
    });
  } catch (err) {
    console.error('Login hatası:', err);
    res.status(500).json({ message: 'Sunucu hatası', type: 'error' });
  }
});

app.post('/films', async (req, res) => {
  try {
    const film = new Film(req.body);
    await film.save();
    // Redis cache'i temizle
    await redisClient.del('all_films');
    // RabbitMQ'ya mesaj gönder
    if (rabbitChannel) {
      try {
        await rabbitChannel.sendToQueue('film_events', Buffer.from(`Yeni film eklendi: ${film.title}`));
        console.log(`RabbitMQ'ya mesaj gönderildi: Yeni film eklendi: ${film.title}`);
      } catch (err) {
        console.error('RabbitMQ mesaj gönderme hatası:', err);
      }
    } else {
      console.error('RabbitMQ channel yok, mesaj gönderilemedi!');
    }
    res.status(201).json(film);
  } catch (error) {
    res.status(400).json({ message: 'Film oluşturulurken hata oluştu', error: error.message });
  }
});

app.get('/films', async (req, res) => {
  console.log('/films e istek atıldı');
  try {
    // Redis cache kontrolü
    const cachedFilms = await redisClient.get('all_films');
    if (cachedFilms) {
      console.log('Filmler Redis cache üzerinden döndü.');
      return res.json(JSON.parse(cachedFilms));
    }
    // Cache yoksa MongoDB'den çek
    const films = await Film.find().sort({ averageRating: -1 });
    try {
      await redisClient.set('all_films', JSON.stringify(films), { EX: 60 });
      console.log('Filmler MongoDB üzerinden döndü ve Redis\'e yazıldı.');
    } catch (err) {
      console.error('Redis yazma hatası:', err);
    }
    res.json(films);
  } catch (err) {
    console.error('Error in /films:', err);
    res.status(500).json({ message: 'Sunucu hatası', error: err.message });
  }
  console.log("qğdkasğda")
});

module.exports = app;

console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? 'Var' : 'YOK');
