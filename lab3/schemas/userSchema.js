import Joi from "joi";

export const userSchema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    age: Joi.number().min(1).max(120).allow(null),
    role: Joi.string().valid("admin", "user").required()
});
