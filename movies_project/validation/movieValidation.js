const Joi = require('joi');

// Movie creation schema
const movieSchema = Joi.object({
    id: Joi.number().integer().required(),
    title: Joi.string().required(),
    genres: Joi.array().items(Joi.string()).unique().required(),
    original_language: Joi.string().required(),
    runtime: Joi.number().integer().positive().required(),
    release_year: Joi.number().integer().max(new Date().getFullYear()).required(),
    production_countries: Joi.array().items(Joi.string()).unique()
});

module.exports = movieSchema;
