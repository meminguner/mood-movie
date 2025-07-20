const mongoose = require('mongoose');

const filmSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  director: { type: String, required: true },
  year: { type: Number, required: true },
  duration: { type: Number, required: true },
  genre: [{ type: String }],
  cast: [{ type: String }],
  image: { type: String, required: true },
  rating: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Film', filmSchema); 