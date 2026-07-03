/**
 * Custom operational AppError class to represent known HTTP/domain errors
 */
class AppError extends Error {
  /**
   * @param {string} message 
   * @param {number} statusCode 
   * @param {any[]} errors - Detail list of errors (like Joi validation details)
   */
  constructor(message, statusCode, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true; // Flag to identify operational errors from program errors

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
