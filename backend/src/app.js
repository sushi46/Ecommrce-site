import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import errorHandler from "./middlewares/errormiddleware.js"
import { version1 } from "./constants.js"
import { globalRateLimit } from "./middlewares/AuthRateLimit.js"
import { clerkMiddleware} from "@clerk/express"
import {clerkClient} from "./utilities/authservice.js"

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


app.use(clerkMiddleware({
    clerkClient
}))


// app.use(globalRateLimit)

import userRouter from "./routes/user.route.js"

app.use(`${version1}/users`, userRouter )

// app.get("/working", (req, res)=>{
//     res.send("thihs is working")
// })

app.get("/", (req, res)=>{
    res.send("Home")
})

app.use(errorHandler)


export default app