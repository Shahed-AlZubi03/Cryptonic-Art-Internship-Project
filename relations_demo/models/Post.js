const mongoose = require('mongoose');

// post schema
const postSchema = new mongoose.Schema({
    title: String,
    content: String,
    user:{type: mongoose.Schema.Types.ObjectId, ref: 'User'}, // Reference to User model that created the post
    tags:[{type: mongoose.Schema.Types.ObjectId, ref:'Tag'}]
});

module.exports= mongoose.model('Post', postSchema);