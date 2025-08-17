const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    adult: Boolean,
    budget: Number,
    genres: [String],
    original_language: String,
    popularity: Number,
    production_countries: [String],
    revenue: Number,
    runtime: Number,
    vote_average: { type: Number, default: 0 },
    vote_count: { type: Number, default: 0 },
    release_year: Number
});

module.exports = mongoose.model('Movie', movieSchema);