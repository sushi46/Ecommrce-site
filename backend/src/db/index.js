import mongoose from "mongoose"
import  { databaseName }  from "../constants.js"



const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODBURI}/${databaseName}`)
    console.log("Database has been connected successfully")
  } catch ( error) {
    console.log("Database connection failed", error)
  }
}

export default connectDB