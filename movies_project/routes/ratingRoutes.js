const express = require('express');
const Rating = require('../models/Rating');
const validate = require('../middleware/validate');
const { ratingSchema } = require('../validation/ratingValidation');
const router = express.Router();

// Show Movies
router.get('/rates', async(req,res)=>{
    res.json(await Rating.find())
    });


// Show Movie's Rate with aggregation
router.get('/:id', async (req, res) => {
    try {
        const movie_id = parseInt(req.params.id);
 
        const result = await Rating.aggregate([
            // Stage 1: match ratings for the given movieId
            { $match: { movieId: movie_id } },

            // Stage 2: join with Movie collection
            {
                $lookup: {
                    from: 'movies',          // collection name in MongoDB
                    localField: 'movieId',   // field in Rating Model 
                    foreignField: 'id',      // field in Movie Model
                    as: 'movieDetails'
                }
            },

            // Stage 3: flatten movieDetails array
            { $unwind: '$movieDetails' },

            // Stage 4: group to calculate average rating and count
            {
                $group: {
                    _id: '$movieId',
                    title: { $first: '$movieDetails.title' },
                    genres: { $first: '$movieDetails.genres' },
                    runtime: { $first: '$movieDetails.runtime' },
                    release_year: { $first: '$movieDetails.release_year' },
                    avgRating: { $avg: '$rating' },
                    totalRatings: { $sum: 1 },
                    ratings: { $push: { userId: '$userId', rating: '$rating' } }
                }
            }
        ]);

        if (result.length === 0)return res.status(404).json({ message: 'Movie or ratings not found' });
        res.json(result[0]);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


// create a rate
router.post('/:id',  validate(ratingSchema), async (req, res) =>{
    try {
    const { userId, rating, timestamp } = req.body;
    const rate = await Rating.create({ userId, movieId: parseInt(req.params.id), rating, timestamp });
    res.json(rate);
    
} catch(err){
    res.status(400).json({ message: err.message });
}
});


// delete rate:
router.delete('/:id', async (req, res) => {
  try {
    const rate_Id = req.params.id;
    const deletedRate = await Rating.findByIdAndDelete(rate_Id);

    if (!deletedRate) return res.status(404).json({ message: 'Rate not found' });
    res.json({ message: 'Rate deleted successfully' });
  } 
  catch (err) {
    res.status(400).json({ message: err.message });
  }
});


module.exports = router;