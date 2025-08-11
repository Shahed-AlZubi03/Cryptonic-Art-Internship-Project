const mongoose = require ('mongoose');

// address schema
const addressSchema = new mongoose.Schema({
  street: String,
  city: String,
  zip: String
});

// user schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true},
    email: { type: String, required: true, unique: true },
    addresses: [addressSchema]
});

module.exports = mongoose.model('User', userSchema);