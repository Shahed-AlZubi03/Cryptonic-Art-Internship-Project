//----------- Import models -----------//
require('dotenv').config();
const User =require('./models/User');
const Post = require('./models/Post');  
const Tag = require('./models/Tag');
const express =require('express');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 2222;
const app=express();

app.use(express.json());
const mongourl = process.env.DB_URL || 'mongodb://localhost:27017/relations_db';

// api middleware connection
const apiKeyMiddleWare= (req, res, next) => {
    const clientKey = req.headers['x-api-key'];
    const serverKey = process.env.API_KEY;
    if (clientKey && clientKey === serverKey) next();
    else res.status(401).json({ error: 'Unauthorized: Invalid or missing API Key' });
};
// app.use(['/users', '/tags', '/posts', '/addresses'], apiKeyMiddleWare);
app.use(apiKeyMiddleWare); // Protect all routes


//mongoDB connection
mongoose.connect(mongourl)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.log('MongoDB connection error:', err.message));


//----------- Routes -----------//
app.get('/', (req,res) =>{
    res.send("Welcome to the Relations Demo API🎉");
});

app.get('/users', async(req,res)=>{
    const users = await User.find();
    res.json(users)
})

// create user:
app.post('/users', async (req, res) => {
try{
    const { name, email , address} = req.body;
    if (!name || !email || !address) 
      return res.status(400).send('All fields are required.');
    const user = await User.create({ name, email, address});
    res.json(user);
    } catch(err){
        res.status(400).json({ message: err.message });
    }
});

// Add an address to existing user
app.post('/users/:id/addresses', async (req, res) => {
  try {
    const { street, city, zip } = req.body;
    if (!street || !city || !zip) return res.status(400).json({ error: 'All fields are required.' });
    
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.addresses.push({ street, city, zip });
    await user.save();
    res.status(201).json(user);
  } 
  catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// create tag:
app.post('/tags', async (req, res) => {
    try{
        const { name } = req.body;
        if (!name) 
            return res.status(400).send('Name field is required.');
        const tag = await Tag.create({name});
        res.json(tag);
     }
    catch(err){
        res.status(400).json({message: err.message});
    }
    });
    
// create post:
app.post('/posts', async (req, res) => {
  try {
    const { title, content, userId, tagIds } = req.body;
    if (!title || !content || !userId || !tagIds) 
            return res.status(400).send('Name field is required.');
    const post = await Post.create({ title, content, user: userId, tags: tagIds });
    res.json(post);

  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

// get all posts:
app.get('/posts', async (req, res) => {
    try{
        const posts = await Post.find()
            .populate('user', 'name email') // populate user (only name, email)
            .populate('tags', 'name');      // populate tags (only name)
        res.json(posts);
    } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});
// delete user:
app.delete('/users/:id', async (req, res) => {
    try{
        const userId= req.params.id;
        const deleteduser = await User.findByIdAndDelete(userId);

        if (!deleteduser) return res.status(404).send('user not found');
        // Delete all posts of this user (cascade delete)
        await Post.deleteMany({ user: userId });

        res.json({ message: 'User and their posts deleted successfully' });

    }
    catch{
        res.status(400).json({message: 'User not found.'});
    }
});

// delete tag:
app.delete('/tags/:id', async (req, res) => {
    try{
        const tagId = req.params.id;
        const deletedTag = await Tag.findByIdAndDelete(tagId);
        
        if (!deletedTag) return res.status(404).send('tag not found');
        await Post.updateMany(
            { tags: tagId },
            { $pull: { tags: tagId } }
            );
        res.status(200).json({ message: 'Tag deleted successfully and removed from posts' });
    }
    catch(err){
        res.status(400).json({message: 'tag not found.'});

    }
});

// delete post:
app.delete('/posts/:id', async (req, res) => {
  try {
    const postId = req.params.id;
    const deletedPost = await Post.findByIdAndDelete(postId);

    if (!deletedPost) return res.status(404).json({ message: 'Post not found' });
    res.json({ message: 'Post deleted successfully' });
  } 
  catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// start the server
app.listen(PORT, () => {
  console.log(`🚀🚀🚀🚀 Server running on http://localhost:${PORT}`);
});
