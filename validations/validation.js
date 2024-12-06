const joi = require("joi");

// From the labs
// Validation of the length and email elements in registration
// with the new lines of first_name and last_name added
const registerValidation = (data) => {
  schemaValidation = joi.object({
    username: joi.string().required().min(3).max(256),
    first_name: joi.string().required().min(1).max(256),
    last_name: joi.string().required().min(1).max(256),
    email: joi.string().required().min(6).max(256).email(),
    password: joi.string().required().min(6).max(1024),
  });
  return schemaValidation.validate(data);
};

// Validation of the login data
const loginValidation = (data) => {
  schemaValidation = joi.object({
    email: joi.string().required().min(6).max(256).email(),
    password: joi.string().required().min(6).max(1024),
  });
  return schemaValidation.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
