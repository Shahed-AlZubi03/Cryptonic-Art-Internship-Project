// server.js
require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 2003;
const mongoURL = process.env.DB_URL || 'mongodb://localhost:27017/calories_db';

app.use(express.json());

// API key Middleware
const apiKeyMiddleWare = (req, res, next) => {
  const clientKey = req.headers['x-api-key'];
  const serverKey = process.env.API_KEY;
  if (clientKey && clientKey === serverKey) next();
  else res.status(401).json({ error: 'Unauthorized: Invalid or missing API Key' });
};

// MongoDB Connection
mongoose.connect(mongoURL)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('MongoDB connection error:', err.message));

// Define Schemas
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String
});

const calorieSchema = new mongoose.Schema({
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  item: { type: String, required: true },
  servingSize: String,
  calories: Number,
  caloriesFromFat: Number,
  totalFat: Number,
  totalFatPercent: Number,
  saturatedFat: Number,
  saturatedFatPercent: Number,
  transFat: Number,
  cholesterol: Number,
  cholesterolPercent: Number,
  sodium: Number,
  sodiumPercent: Number,
  carbohydrates: Number,
  carbohydratesPercent: Number,
  dietaryFiber: Number,
  dietaryFiberPercent: Number,
  sugars: Number,
  protein: Number,
  vitaminAPercent: Number,
  vitaminCPercent: Number,
  calciumPercent: Number,
  ironPercent: Number
});

// Create Models
const Category = mongoose.model('Category', categorySchema);
const Calorie = mongoose.model('Calorie', calorieSchema);
app.use('/calories', apiKeyMiddleWare);

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the Calories API');
});

// Get calories (with population)
app.get('/calories', async (req, res) => {
  const { category, item } = req.query;
  let filter = {};
  if (item) filter.item = { $regex: item, $options: 'i' };

  try {
    let query = Calorie.find(filter).populate('category');
    let results = await query.exec();

    // If category filter exists, filter after populate
    if (category) {
      results = results.filter(c =>
        c.category.name.toLowerCase().includes(category.toLowerCase())
      );
    }

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Add a new calorie entry
app.post('/calories', async (req, res) => {
  try{
  const requiredFields = [
  "category", "item", "servingSize", "calories", "caloriesFromFat", "totalFat", "totalFatDailyValue",
  "saturatedFat", "saturatedFatDailyValue", "transFat", "cholesterol", "cholesterolDailyValue", "sodium", "sodiumDailyValue",
  "carbohydrates", "carbohydratesDailyValue", "dietaryFiber", "dietaryFiberDailyValue", "sugars", "protein",
  "vitaminA", "vitaminC", "calcium", "iron"
];

    
for (const field of requiredFields) {
  if (!req.body[field]) return res.status(400).send(`${field} is required`);
}

const newItem = new Calorie(req.body);
await newItem.save();
res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a calorie entry by ID
app.patch('/calories/:id', async (req, res) => {
  try {
    const calorieId = req.params.id;
    const updatedCalorie = await Calorie.findByIdAndUpdate(calorieId, req.body, { new: true });
    
    if (!updatedCalorie) return res.status(404).send('Item not found'); 
    res.status(200).json(updatedCalorie);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// delete a calorie entry by ID
app.delete('/calories/:id', async (req, res) => {
  try {
    const calorieId = req.params.id;
    const deletedCalorie = await Calorie.findByIdAndDelete(calorieId);

    if (!deletedCalorie) return res.status(404).send('Item not found');
    res.status(200).json({ message: 'Item deleted', deletedCalorie });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀🚀🚀🚀 Server running on http://localhost:${PORT}`);
});
