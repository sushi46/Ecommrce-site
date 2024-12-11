import mongoose from "mongoose"
import  { databaseName }  from "../constants.js"
import ApiError from "../utilities/apiError.js"
import ApiResponse from "../utilities/apiResponse.js";



const connectDB = async () => {
  try {
    const dataBaseConnect = await mongoose.connect(`${process.env.MONGODBURI}/${databaseName}`);
    console.log(
      ApiResponse.success(
        `Database has been connected successfully at HOST: ${dataBaseConnect.connection.host}`
      ).toJSON()
    );
  } catch (error) {
    const apiError = new ApiError(
      500,
      "Database connection failed",
      { originalError: error.message }
    );
    console.error(apiError);
    throw apiError; 
  }
};

export default connectDB