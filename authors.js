require('dotenv').config();
const express =require('express');
const mongoose =require ('mongoose');
const app = express();
const PORT = process.env.PORT || 4001;

app.use(express.json());

const apiKeyMiddleWare= (req, res, next) => {
    const clientKey = req.headers['x-api-key'];
    const serverKey = process.env.API_KEY;
    if (clientKey && clientKey === serverKey) next();
    else res.status(401).json({ error: 'Unauthorized: Invalid or missing API Key' });
};

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/books_authors_db';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('MongoDB connection error:', err.message)); // Fix: you missed (err) in the catch


const auther_schema = new mongoose.Schema({
    name: String,
    age: Number,
    bio: String,
    books: [String]
}); 
const Author = mongoose.model('Author', auther_schema);
app.use('/authors', apiKeyMiddleWare); // Apply API key middleware to all /authors routes

app.get('/', (req, res) => {
  res.send('Welcome to the Authors Management API');
});

app.get('/authors', async (req, res) => {
  try {
  const { name, age, book } = req.query;
  const query = {};

  if (name) query.name = { $regex: name, $options: 'i' };
  if (age) query.age = Number(age);
  if (book) query.books = { $regex: book, $options: 'i' };

    const authors = await Author.find(query); // ✅ correct
    res.status(200).json(authors);       
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// Add a new user
app.post('/authors', async (req, res) => {
  try {
    const { name, age, bio, books } = req.body;
    if (!name || !age || !bio || !books) 
      return res.status(400).send('All fields are required.');

    const newAuthor = new Author({ name, age, bio, books  });
    await newAuthor.save();
    res.status(201).json(newAuthor);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// Update a user by ID
app.patch('/authors/:id', async (req, res) => {
  try {
    const authorId = req.params.id;
    const updatedAuthor = await Author.findByIdAndUpdate(authorId, req.body, { new: true });

    if (!updatedAuthor) return res.status(404).send('Author not found'); 
    res.status(200).json(updatedAuthor);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Remove a user by ID
app.delete('/authors/:id', async (req, res) => {
  try {
    const authorId = req.params.id;
    const deletedauther = await Author.findByIdAndDelete(authorId);

    if (!deletedauther) return res.status(404).send('Author not found');
    res.status(200).json({ message: 'author deleted', deletedauther });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Start the Server
app.listen(PORT, () => {
  console.log(`🚀🚀🚀🚀 Server running on http://localhost:${PORT}`);
});
