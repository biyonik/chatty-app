import Joi, { ObjectSchema } from 'joi';

const SignupSchema: ObjectSchema = Joi.object().keys({
    username: Joi
        .string()
        .required()
        .min(4)
        .max(24)
        .messages({
            'string.base': 'Username must be of type string!',
            'string.min': 'Username must be at least 4 characters!',
            'string.max': 'Username must be at most 24 characters!',
            'string.empty': 'Username must not be empty!'
        }),
    password: Joi
        .string()
        .required()
        .min(6)
        .max(16)
        .messages({
            'string.base': 'Password must be of type string!',
            'string.min': 'Password must be at least 6 characters!',
            'string.max': 'Password must be at most 16 characters!',
            'string.empty': 'Password must not be empty!'
        }),
    email: Joi
        .string()
        .required()
        .email()
        .messages({
            'string.base': 'Username must be of type string!',
            'string.email': 'Email must be valid!',
            'string.empty': 'Username must not be empty!'
        }),
    avatarColor: Joi
        .string()
        .required()
        .messages({
            'any.required': 'Avatar color is required!'
        }),
    avatarImage: Joi
        .string()
        .required()
        .messages({
            'any.required': 'Avatar image is required!'
        })
});

export {SignupSchema};
