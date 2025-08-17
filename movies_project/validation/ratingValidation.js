// validators.js
const Joi = require('joi');

// Rating creation schema
const ratingSchema = Joi.object({
    userId: Joi.number().integer().required(),
    rating: Joi.number().min(0).max(5).required(),
    timestamp: Joi.date().max('now').timestamp().required()
});

module.exports = ratingSchema;
