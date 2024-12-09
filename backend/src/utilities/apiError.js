class ApiError extends Error {
    constructor(statusCode, message, details = null) {
      super(message);
      this.statusCode = statusCode;
      this.details = details;
  
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
      }
    }
  
    // 400 - Bad Request
    static badRequest(message, details = null) {
      return new ApiError(400, message, details);
    }
  
    // 401 - Unauthorized
    static unauthorized(message, details = null) {
      return new ApiError(401, message, details);
    }
  
    // 403 - Forbidden
    static forbidden(message, details = null) {
      return new ApiError(403, message, details);
    }
  
    // 404 - Not Found
    static notFound(message, details = null) {
      return new ApiError(404, message, details);
    }
  
    // 405 - Method Not Allowed
    static methodNotAllowed(message = 'Method Not Allowed', details = null) {
      return new ApiError(405, message, details);
    }
  
    // 409 - Conflict
    static conflict(message, details = null) {
      return new ApiError(409, message, details);
    }
  
    // 422 - Unprocessable Entity
    static unprocessableEntity(message, details = null) {
      return new ApiError(422, message, details);
    }
  
    // 429 - Too Many Requests
    static tooManyRequests(message = 'Too Many Requests', details = null) {
      return new ApiError(429, message, details);
    }
  
    // 500 - Internal Server Error
    static internal(message, details = null) {
      return new ApiError(500, message, details);
    }
  
    // 502 - Bad Gateway
    static badGateway(message = 'Bad Gateway', details = null) {
      return new ApiError(502, message, details);
    }
  
    // 503 - Service Unavailable
    static serviceUnavailable(message = 'Service Unavailable', details = null) {
      return new ApiError(503, message, details);
    }
  
    // 504 - Gateway Timeout
    static gatewayTimeout(message = 'Gateway Timeout', details = null) {
      return new ApiError(504, message, details);
    }
  }
  
export default ApiError
  