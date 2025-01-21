import ApiError from "../utilities/apiError.js"
import ApiResponse from "../utilities/apiResponse.js"

const errorHandler = (err, req, res, next) => {
    if (err instanceof ApiError) {
        return res
          .status(err.statusCode)
          .json(ApiResponse.error(err.message, err.details).toJSON());
      }
    
      console.error('Unexpected error:', err);


      if (err.name === "ValidationError") {
        const errors = Object.values(err.errors).map((e) => e.message);
        const response = ApiResponse.error("Validation error", { errors });
        return res.status(400).json(response.toJSON());
      }
      
    
      const genericError = new ApiError(
        500,
        'An unexpected error occurred.',
        process.env.NODE_ENV === 'development' ? { stack: err.stack } : null
      );
    
      return res
        .status(genericError.statusCode)
        .json(ApiResponse.error(genericError.message, genericError.details).toJSON());
}

export default errorHandler