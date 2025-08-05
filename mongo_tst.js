const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = 3030;

// Middleware
app.use(express.json());

// MongoDB connection
const mongoURI = 'mongodb://localhost:27017/my_test_db';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Error connecting to MongoDB:', err));

// Define a Mongoose schema and model for `users`
const userSchema = new mongoose.Schema({
//id: Number,
name: String,
age: Number,
email: String,
skills: Array,
isStudent: Boolean
});

const User = mongoose.model('User', userSchema);
console.log('User model created:', User.schema.obj);

// API Routes

// 1. CREATE - Add a new user
app.post('/users', async (req, res) => {
  try {
    const { name, age, email, skills, isStudent } = req.body;
    if (!name || !age || !email || !skills || isStudent === undefined) {
      return res.status(400).send('all field are required.');
    }
    const newUser = new User({ name, age, email, skills, isStudent});
    await newUser.save();  // Save user to DB
    res.status(201).json(newUser); // Send back the saved user
  } catch (err) {
    res.status(400).json({error:err.message});
  }
});

// 2. READ - Get all users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();  // Get all users
    res.status(200).json(users);      // Send all users back
  } 
  catch (err) {
    res.status(400).json({error:err.message});
  }
});

// 3. UPDATE - Update user by ID
app.patch('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true });
    if (!updatedUser) return res.status(404).send('User not found');
    res.status(200).json(updatedUser);  // Send updated user back
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 4. DELETE - Delete user by ID
app.delete('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) return res.status(404).send('User not found');
    res.status(200).json({ message: 'User deleted!', deletedUser });  // Success message
  } catch (err) {
    res.status(400).json({error:err.message});
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
