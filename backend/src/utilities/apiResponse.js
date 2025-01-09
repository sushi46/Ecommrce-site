class ApiResponse {
    constructor(success, message, data = null, meta = null) {
      this.success = success;
      this.message = message;
      this.data = data;
      this.meta = meta; 
    }
  
    static success(message, data = null, meta = null) {
      return new ApiResponse(true, message, data, meta);
    }
  
    static error(message, details = null) {
      return new ApiResponse(false, message, details);
    }

    toJSON() {
      const response = {
        success: this.success,
        message: this.message,
      };
  
      if (this.data !== null) {
        response.data = this.data;
      }
  
      if (this.meta !== null) {
        response.meta = this.meta;
      }
  
      return response;
    }
  }
  
 export default ApiResponse
  