const express = require('express');
const Movie = require('../models/Movie');
const Rating = require('../models/Rating');
const validate = require('../middleware/validate');
const { movieSchema } = require('../validation/movieValidation');
const router = express.Router();

// Show Movies (with optional title filter)
router.get('/', async (req, res) => {
    try {
        const { title } = req.query;  // query param: ?title=Inception
        let filter = {};

        if (title) {
            filter.title = { $regex: title, $options: 'i' }; // case-insensitive search
        }

        const movies = await Movie.find(filter); 
        res.json(movies);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


// agregated movies
router.get('/aggregated', async(req,res) =>{
  try {
    const aggregated_movies = await Movie.aggregate([
      {
        $lookup: {
          from: "ratings",            // collection name in MongoDB
          localField: "id",          // use _id of Movie
          foreignField: "movieId",    // Rating.movieId must reference Movie._id
          as: "ratings"
        }
      },
      { $unwind: "$genres" },        // unwind genres if array
   //   { $unwind: "$ratings" },       // unwind ratings array
      {
        $group: {
          _id: "$genres",
          avgRating: { $avg: "$ratings.rating" }
        }
      },
      { $sort: { avgRating: -1 } }
    ]);

    res.json(aggregated_movies);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Show Movie by Id
router.get('/:id', async (req, res) => {
    try{
        const movie = await Movie.find({ id: req.params.id });
        const rate = await Rating.find({ movieId: parseInt(req.params.id) }).select('movieId rating');
        res.json({movie, rate});
    } catch (error) {
    res.status(400).json({ error: error.message });
  }
});



// create a movie
router.post('/', validate (movieSchema), async (req, res) => {
    try{
        const {movie}= req.body;
        const createdMovie = await Movie.create(movie);
        res.json(createdMovie);

    }
    catch(err){
        res.status(400).json({ message: err.message });
    }
});

// delete movie:
router.delete('/:id', async (req, res) => {
    try {
        const movie_Id = parseInt(req.params.id);
        const deletedMovie = await Movie.findByIdAndDelete({ id: movie_Id });

        if (!deletedMovie) return res.status(404).send('Movie not found');

        await Rating.deleteMany({ movieId: movie_Id });

        res.json({ message: 'Movie and its rates deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;