import Joi from "joi";

const registerMemberValidation = Joi.object({
    code: Joi.string().required().max(20),
    name: Joi.string().required().max(100)
});

const getMemberValidation = Joi.string().required().max(20);

export {
    registerMemberValidation,
    getMemberValidation
};