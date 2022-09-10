const Joi = require("joi");

module.exports.validateCards = Joi.object({
  cards: Joi.array().min(1).required(),
});

module.exports.validateCard = Joi.object({
  bizName: Joi.string().min(2).max(255).required(),
  bizDescription: Joi.string().min(2).max(1024).required(),
  bizAddress: Joi.string().min(2).max(400).required(),
  bizPhone: Joi.string()
    .min(9)
    .max(10)
    .required(),
    // .regex(/^0[2-9]\d{7,8}$/),
  bizImage: Joi.string().min(11).max(1024),
});
