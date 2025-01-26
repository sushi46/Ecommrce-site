import dotenv from "dotenv"
import connectDB from "./db/index.js"
import app from "./app.js"
import  http from "http"
import {Server} from "socket.io"
import { handleJoin, handleMessage, handleDisconnect } from "./utilities/socket.io/events.js"


dotenv.config({
    path: '../.env'
})

const server = http.createServer()
const io = new Server(server)

io.on("connection", (socket)=> {
  console.log(`user connected : ${socket.id}`)

  handleJoin(socket)
  handleMessage(io, socket)
  handleDisconnect(socket)
})



connectDB()

app.listen(process.env.PORT, (req, res)=>{
console.log("it has begun")
})


