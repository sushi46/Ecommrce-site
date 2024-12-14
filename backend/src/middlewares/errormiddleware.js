import apiError from "../utilities/apiError.js"
import apiResponse from "../utilities/apiResponse.js"

const errorHandler = (err, req, res, next) => {
    if (err instanceof apiError) {
        return res
          .status(err.statusCode)
          .json(apiResponse.error(err.message, err.details).toJSON());
      }
    
      console.error('Unexpected error:', err);
    
      const genericError = new apiError(
        500,
        'An unexpected error occurred.',
        process.env.NODE_ENV === 'development' ? { stack: err.stack } : null
      );
    
      return res
        .status(genericError.statusCode)
        .json(apiResponse.error(genericError.message, genericError.details).toJSON());
}

export default errorHandler