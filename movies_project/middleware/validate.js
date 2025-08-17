// middleware/validate.js
const Joi = require('joi');

module.exports = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, {
            abortEarly: false,  // Collect all errors, not just the first
            allowUnknown: false // Reject any extra fields not in schema
        });

        if (error) {
            return res.status(400).json({
                status: 'error',
                message: 'Validation failed',
                errors: error.details.map(detail => detail.message)
            });
        }

        next();
    };
};
