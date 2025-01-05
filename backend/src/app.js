import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import errorHandler from "./middlewares/errormiddleware.js"
import { version1 } from "./constants.js"
import { globalRateLimit } from "./middlewares/AuthRateLimit.js"



const app = express()


app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type']
}))


app.use(express.json({limit: "16kb"}))

app.use(express.urlencoded({extended: true, limit: "16kb"}))

app.use(express.static("public"))

app.use(cookieParser())




// app.use(globalRateLimit)




import userRouter from "./routes/user.route.js"


app.use(`${version1}/users`, userRouter )

//app.use(errorHandler)


export default app