import Joi from "joi";

const registerBookValidation = Joi.object({
    code: Joi.string().required().max(20),
    title: Joi.string().required().max(100),
    author: Joi.string().required().max(100),
    stock: Joi.number().required().positive().min(1)
});

const updateBookValidation = Joi.object({
    code: Joi.string().required().max(20),
    title: Joi.string().required().max(100),
    author: Joi.string().required().max(100),
    stock: Joi.number().required().positive().min(1)
});

const getBookValidation = Joi.string().required().max(20);

export {
    registerBookValidation,
    updateBookValidation,
    getBookValidation
};