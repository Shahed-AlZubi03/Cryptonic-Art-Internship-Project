const mongoose = require ('mongoose');

// tag schema
const tagSchema = new mongoose.Schema({ 
    name: String,
});

module.exports = mongoose.model('Tag', tagSchema);