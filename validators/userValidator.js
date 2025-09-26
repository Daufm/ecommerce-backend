import Joi from "joi";

export const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(128).required(),
  phone: Joi.string().pattern(/^\+?[0-9]{10,15}$/).optional(),

  addresses: Joi.array().items(Joi.object({
    label: Joi.string().optional(),
    name: Joi.string().trim().required(),
    line1: Joi.string().trim().required(),
    line2: Joi.string().trim().allow(""),
    city: Joi.string().trim().required(),
    state: Joi.string().trim().optional(),
    postalCode: Joi.string().trim().required(),
    country: Joi.string().trim().required(),
    phone: Joi.string().trim().optional(),
  })).optional(),
});
