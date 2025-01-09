import dotenv from "dotenv"
import connectDB from "./db/index.js"
import app from "./app.js"

dotenv.config({
    path: '../.env'
})



connectDB()

app.listen(process.env.PORT, (req, res)=>{
console.log("it has begun")
})


