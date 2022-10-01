import Joi, {ObjectSchema} from 'joi';

const EmailSchema: ObjectSchema = Joi.object().keys({
    email: Joi
        .string()
        .email()
        .required()
        .messages({
            'string.base': 'Field must be valid',
            'string.required': 'Field must be valid',
            'string.email': 'Field must be valid'
        })
});

const EmailPasswordSchema: ObjectSchema = Joi.object().keys({
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
    confirmPassword: Joi
        .string()
        .required()
        .valid(Joi.ref('password'))
        .messages({
            'any.only': 'Passwords should match',
            'any.required': 'Confirm password is a required field'
        })
});

export {EmailSchema, EmailPasswordSchema};
