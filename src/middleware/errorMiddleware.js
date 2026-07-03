const AppError = require('../utils/appError');
const ApiResponse = require('../utils/apiResponse');

/**
 * Centralized Error Handling Middleware
 */
const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';

  // Log only unexpected 500 errors in development
  if (process.env.NODE_ENV === 'development' || err.statusCode === 500) {
    console.error(`[ERROR] ${req.method} ${req.url} - `, err);
  }

  // Handle Prisma Unique Constraint error (e.g. Email already exists)
  if (err.code === 'P2002') {
    const fields = err.meta?.target || [];
    err = new AppError(
      `Duplicate field value entered: ${fields.join(', ')}. Please use another value.`,
      409
    );
  }

  // Handle Prisma Record Not Found error
  if (err.code === 'P2025') {
    err = new AppError('Record not found', 404);
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    err = new AppError('Invalid token. Please log in again.', 401);
  }
  if (err.name === 'TokenExpiredError') {
    err = new AppError('Your token has expired. Please log in again.', 401);
  }

  // Final structured API error response
  return res.status(err.statusCode).json(
    ApiResponse.error(err.message, err.errors)
  );
};

module.exports = errorMiddleware;
