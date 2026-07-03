const AppError = require('../utils/appError');

const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      return next(new AppError(errorMessages.join(', '), 400));
    }
    req.body = value;
    next();
  };
};

module.exports = validate;
