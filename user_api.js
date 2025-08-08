// Import and Initialize
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3030;

app.use(express.json());

//API Key Middleware: This middleware checks if the incoming request contains a valid API key in headers
const apiKeyMiddleware = (req, res, next) => {
  const clientKey = req.headers['x-api-key'];       
  const serverKey = process.env.API_KEY; 

  if (clientKey && clientKey === serverKey) next(); 
  else res.status(401).json({ error: 'Unauthorized: Invalid or missing API Key' });
};

// MongoDB Connection:
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/my_test_db';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))      
  .catch(err => console.log('MongoDB connection error:', { error: err.message }));

// Define Schema and Model: Mongoose schema: the structure of documents in the "users" collection
const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
  email: String,
  skills: Array,
  isStudent: Boolean
});
const User = mongoose.model('User', userSchema);

app.use('/users', apiKeyMiddleware); // Apply API key middleware to all /users routes (GET, POST, PATCH, DELETE)

app.get('/', (req, res) => {
  res.send('Welcome to the User Management API');
});

// Add a new user
app.post('/users', async (req, res) => {
  try {
    const { name, age, email, skills, isStudent } = req.body;
    if (!name || !age || !email || !skills || isStudent === undefined) 
      return res.status(400).send('All fields are required.');

    const newUser = new User({ name, age, email, skills, isStudent });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Retrieve all users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();    
    res.status(200).json(users);       
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a user by ID
app.patch('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true });

    if (!updatedUser) return res.status(404).send('User not found'); 
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Remove a user by ID
app.delete('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) return res.status(404).send('User not found');
    res.status(200).json({ message: 'User deleted', deletedUser });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Start the Server
app.listen(PORT, () => {
  console.log(`🚀🚀🚀🚀 Server running on http://localhost:${PORT}`);
});
