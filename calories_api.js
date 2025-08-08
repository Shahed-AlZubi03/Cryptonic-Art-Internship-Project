// Import necessary modules
require('dotenv').config();
const mongoose = require('mongoose');
const express = require ('express');
const app = express();
const PORT = process.env.PORT || 2003;
const mongoURL = process.env.DB_URL || 'mongodb://localhost:27017/calories_db';
app.use(express.json());

//API key Middleware
const apiKeyMiddleWare = (req, res, next) => {
const clientKey = req.headers['x-api-key'];
const serverKey = process.env.API_KEY
if (clientKey && clientKey === serverKey) next(); 
else res.status(401).json({ error: 'Unauthorized: Invalid or missing API Key' });
};

// MongoDB Connection
mongoose.connect(mongoURL)
.then(()=> console.log('Connected to MongoDB'))
.catch((err) => console.log('MongoDB connection error:', err.message));

//Schema Definition
const calorieSchema = new mongoose.Schema({
  category: String,
  item: String,
  servingSize: String,
  calories: Number,
  caloriesFromFat: Number,
  totalFat: Number,
  totalFatDailyValue: Number,
  saturatedFat: Number,
  saturatedFatDailyValue: Number,
  transFat: Number,
  cholesterol: Number,
  cholesterolDailyValue: Number,
  sodium: Number,
  sodiumDailyValue: Number,
  carbohydrates: Number,
  carbohydratesDailyValue: Number,
  dietaryFiber: Number,
  dietaryFiberDailyValue: Number,
  sugars: Number,
  protein: Number,
  vitaminA: Number,
  vitaminC: Number,
  calcium: Number,
  iron: Number
  
});
const Calorie = mongoose.model('Calorie', calorieSchema);
app.use('/calories', apiKeyMiddleWare); // Apply API key middleware to all /calories routes

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the Calories API');
});

app.get('/calories', async (req, res) => {
  const { category, item } = req.query;
  const query = {};

  if (category) query.category = category;
  if (item) query.item = item;

  try {
    const results = await Calorie.find(query); // MongoDB collection
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
