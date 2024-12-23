import dotenv from "dotenv"
import connectDB from "./db/index.js"
import app from "./app.js"

dotenv.config({
    path: '../.env'
})



connectDB()


app.listen(process.env.PORT , ()=>{
    console.log("app has started")
})


app.get("/", (req, res)=> {
  res.send("hello rr")
})