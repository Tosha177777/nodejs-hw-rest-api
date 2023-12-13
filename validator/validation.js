const Joi = require("joi");

exports.createContactValidator = (data) =>
  Joi.object()
    .keys({
      name: Joi.string().required(),
      email: Joi.string().required(),
      phone: Joi.string().required(),
    })
    .validate(data);
