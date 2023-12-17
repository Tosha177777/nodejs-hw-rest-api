const Joi = require("joi");

exports.createContactValidator = (data) =>
  Joi.object()
    .keys({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      phone: Joi.string().required(),
      favorite: Joi.boolean(),
    })
    .validate(data);
