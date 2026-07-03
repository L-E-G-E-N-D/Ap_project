const AppError = require('../utils/appError');
const { error } = require('../utils/apiResponse');

const errorMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = err.errors || null;

  if (err.code === 'P2002') {
    statusCode = 409;
    message = 'Email already exists';
  }

  if (err.code === 'P2025') {
    statusCode = 404;
    message = 'Record not found';
  }

  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  return res.status(statusCode).json(error(message, errors));
};

module.exports = errorMiddleware;
