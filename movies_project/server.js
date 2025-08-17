// import modelsmongodb://localhost:27017/movies_db
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const movieRoutes = require('./routes/movieRoutes');
const ratingRoutes = require('./routes/ratingRoutes');
const app = express();
const PORT = process.env.PORT || 5000;
const mongourl = process.env.DB_URL || 'mongodb://localhost:27017/movies_db';
app.use(express.json());

// API MiddleWare
const apiKeyMiddleWare = (req, res, next) => {
    const serverKey =  process.env.API_KEY;
    const clientKey = req.headers['x-api-key'];
    if (clientKey && clientKey === serverKey) next();
    else res.status(401).send({error: 'Unauthorized'});
}
app.use(apiKeyMiddleWare); // to protect all routes

// mongoDB connection
mongoose.connect(mongourl)
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.get('/', (req,res) =>{res.send("Welcome to the Movies API🎉");});
app.use('/movies', movieRoutes);
app.use('/rates', ratingRoutes);

// start the server
app.listen(PORT, () => {
  console.log(`🚀🚀🚀🚀 Server running on http://localhost:${PORT}`);
});
