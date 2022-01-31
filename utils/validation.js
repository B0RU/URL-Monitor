const joi = require('joi');

const userRegisterValidation = (data) => {
  const userValidationschema = joi.object({
    name: joi.string().min(3).max(30).required(),
    email: joi.string().min(6).required().email(),
    password: joi.string().min(6).required(),
  });

  return userValidationschema.validate(data);
};

const userLoginValidation = (data) => {
  const userValidationschema = joi.object({
    email: joi.string().min(6).required().email(),
    password: joi.string().min(6).required(),
  });

  return userValidationschema.validate(data);
};

module.exports.userRegisterValidation = userRegisterValidation;
module.exports.userLoginValidation = userLoginValidation;
