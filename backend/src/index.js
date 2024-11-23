import express from "express"
import dotenv from "dotenv"
import connectDB from "./db/index.js"


dotenv.config({
    path: '../.env'
})


const app = express()
app.listen(process.env.PORT , ()=>{
    console.log("app has started")
})
connectDB()
