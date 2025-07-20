const express = require('express');
const router = express.Router();
const User = require('../models/User');

// İzlenen filme ekle
router.post('/:userId/watched/:filmId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    if (!user.watchedMovies.includes(req.params.filmId)) {
      user.watchedMovies.push(req.params.filmId);
      // Eğer "daha sonra izle" listesindeyse çıkar
      user.watchLater = user.watchLater.filter(id => id !== req.params.filmId);
      await user.save();
    }
    res.json({ watchedMovies: user.watchedMovies });
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası', error: err.message });
  }
});

// İzlenen filmden çıkar
router.delete('/:userId/watched/:filmId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    user.watchedMovies = user.watchedMovies.filter(id => id !== req.params.filmId);
    await user.save();
    res.json({ watchedMovies: user.watchedMovies });
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası', error: err.message });
  }
});

// Daha sonra izleye ekle
router.post('/:userId/watch-later/:filmId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    if (!user.watchLater.includes(req.params.filmId) && !user.watchedMovies.includes(req.params.filmId)) {
      user.watchLater.push(req.params.filmId);
      await user.save();
    }
    res.json({ watchLater: user.watchLater });
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası', error: err.message });
  }
});

// Daha sonra izle listesinden çıkar
router.delete('/:userId/watch-later/:filmId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    user.watchLater = user.watchLater.filter(id => id !== req.params.filmId);
    await user.save();
    res.json({ watchLater: user.watchLater });
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası', error: err.message });
  }
});

// Kullanıcının izlenen ve daha sonra izle listelerini getir
router.get('/:userId/lists', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    res.json({ watchedMovies: user.watchedMovies, watchLater: user.watchLater });
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası', error: err.message });
  }
});

module.exports = router; 