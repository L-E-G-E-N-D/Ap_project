/**
 * Standardized API response helper class/utility
 */
class ApiResponse {
  /**
   * Send a success response
   * @param {string} message 
   * @param {any} data 
   * @returns {object}
   */
  static success(message, data = null) {
    const response = {
      success: true,
      message,
    };
    if (data !== null) {
      response.data = data;
    }
    return response;
  }

  /**
   * Send an error response
   * @param {string} message 
   * @param {array} errors 
   * @returns {object}
   */
  static error(message, errors = null) {
    const response = {
      success: false,
      message,
    };
    if (errors !== null) {
      response.errors = errors;
    }
    return response;
  }
}

module.exports = ApiResponse;
