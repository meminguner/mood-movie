const express = require('express');
const router = express.Router();
const {
  getAllFilms,
  getFilmById,
  getRandomFilm,
  getTop10Films,
  createFilm,
  updateFilm,
  deleteFilm,
  rateFilm,
  searchFilms
} = require('../controllers/filmController');

// Rastgele film getir
router.get('/random/film', getRandomFilm);

// Top 10 film getir
router.get('/top10/films', getTop10Films);

// Tüm filmleri getir
router.get('/films', getAllFilms);

// Tek film getir
router.get('/:id', getFilmById);

// Film oluştur
router.post('/films', createFilm);

// Film güncelle
router.put('/:id', updateFilm);

// Film sil
router.delete('/:id', deleteFilm);

// Film puanla
router.post('/:id/rate', rateFilm);

// Film arama
router.get('/search', searchFilms);

module.exports = router; 