const Film = require('../models/Film');

// Tüm filmleri getir
const getAllFilms = async (req, res) => {
  console.log("")
  try {
    const films = await Film.find().sort({ averageRating: -1 });
    res.json(films);
  } catch (error) {
    res.status(500).json({ message: 'Filmler getirilirken hata oluştu', error: error.message });
  }
};

// Tek film getir
const getFilmById = async (req, res) => {
  try {
    const film = await Film.findById(req.params.id);
    if (!film) {
      return res.status(404).json({ message: 'Film bulunamadı' });
    }
    res.json(film);
  } catch (error) {
    res.status(500).json({ message: 'Film getirilirken hata oluştu', error: error.message });
  }
};

// Rastgele film getir
const getRandomFilm = async (req, res) => {
  try {
    const count = await Film.countDocuments();
    const random = Math.floor(Math.random() * count);
    const film = await Film.findOne().skip(random);
    
    if (!film) {
      return res.status(404).json({ message: 'Film bulunamadı' });
    }
    res.json(film);
  } catch (error) {
    res.status(500).json({ message: 'Rastgele film getirilirken hata oluştu', error: error.message });
  }
};

// Top 10 film getir
const getTop10Films = async (req, res) => {
  try {
    const films = await Film.find().sort({ averageRating: -1 }).limit(10);
    res.json(films);
  } catch (error) {
    res.status(500).json({ message: 'Top 10 filmler getirilirken hata oluştu', error: error.message });
  }
};

// Film oluştur
const createFilm = async (req, res) => {
  try {
    const film = new Film(req.body);
    await film.save();
    res.status(201).json(film);
  } catch (error) {
    res.status(400).json({ message: 'Film oluşturulurken hata oluştu', error: error.message });
  }
};

// Film güncelle
const updateFilm = async (req, res) => {
  try {
    const film = await Film.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!film) {
      return res.status(404).json({ message: 'Film bulunamadı' });
    }
    res.json(film);
  } catch (error) {
    res.status(400).json({ message: 'Film güncellenirken hata oluştu', error: error.message });
  }
};

// Film sil
const deleteFilm = async (req, res) => {
  try {
    const film = await Film.findByIdAndDelete(req.params.id);
    if (!film) {
      return res.status(404).json({ message: 'Film bulunamadı' });
    }
    res.json({ message: 'Film başarıyla silindi' });
  } catch (error) {
    res.status(500).json({ message: 'Film silinirken hata oluştu', error: error.message });
  }
};

// Film puanla
const rateFilm = async (req, res) => {
  try {
    const { rating } = req.body;
    const film = await Film.findById(req.params.id);
    
    if (!film) {
      return res.status(404).json({ message: 'Film bulunamadı' });
    }

    // Yeni puanı ekle
    const newTotalRatings = film.totalRatings + 1;
    const newAverageRating = ((film.averageRating * film.totalRatings) + rating) / newTotalRatings;

    film.totalRatings = newTotalRatings;
    film.averageRating = Number(newAverageRating.toFixed(1));
    
    await film.save();
    res.json(film);
  } catch (error) {
    res.status(500).json({ message: 'Film puanlanırken hata oluştu', error: error.message });
  }
};

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const searchFilms = async (req, res) => {
  try {
    const query = req.query.q;
    console.log('Arama query:', query);
    if (!query) {
      return res.status(400).json({ message: 'Arama terimi gerekli.' });
    }
    const safeQuery = escapeRegex(query);
    const films = await Film.find({
      title: { $regex: safeQuery, $options: 'i' }
    });
    res.json(films);
  } catch (error) {
    console.error('Arama sırasında hata:', error);
    res.status(500).json({ message: 'Film arama sırasında hata oluştu', error: error.message });
  }
};

module.exports = {
  getAllFilms,
  getFilmById,
  getRandomFilm,
  getTop10Films,
  createFilm,
  updateFilm,
  deleteFilm,
  rateFilm,
  searchFilms
}; 