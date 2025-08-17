const mongoose = require('mongoose');
const Movie = require('./Movie'); // Import the Movie model

const ratingSchema = new mongoose.Schema({    
    userId: { type: Number, required: true },
    movieId: { type: Number, ref: 'Movie', required: true },
    rating: { type: Number, required: true },
    timestamp: { type: Date}
});

// Validate movieId before saving
ratingSchema.pre('save', async function (next) {
    const movieExists = await Movie.exists({ id: this.movieId });
    if (!movieExists) return next(new Error(`Movie with id ${this.movieId} does not exist`));
    next();
});

module.exports = mongoose.model('Rating', ratingSchema);
