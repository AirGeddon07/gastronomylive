import { setServers } from "node:dns/promises";
setServers(["8.8.8.8", "1.1.1.1"]);

import express from "express"
import dotenv from "dotenv"
dotenv.config()
import connectDb from "./config/db.js"
import cookieParser from "cookie-parser"
import authRouter from "./routes/auth.routes.js"
import cors from "cors"
import userRouter from "./routes/user.routes.js"
import itemRouter from "./routes/item.routes.js"
import shopRouter from "./routes/shop.routes.js"
import orderRouter from "./routes/order.routes.js"
import aiRouter from "./routes/aiRoutes.js" 
import http from "http"
import { Server } from "socket.io"
import { socketHandler } from "./socket.js"

const app=express()
const server=http.createServer(app)

// ✨ NEW: Tells the backend to accept your local frontend OR your future live frontend
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

const io=new Server(server,{
   cors:{
    origin: frontendUrl,
    credentials:true,
    methods:['POST','GET']
}
})

app.set("io",io)

const port=process.env.PORT || 8000
app.use(cors({
    origin: frontendUrl,
    credentials:true
}))

app.use(express.json())
app.use(cookieParser())
app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)
app.use("/api/shop",shopRouter)
app.use("/api/item",itemRouter)
app.use("/api/order",orderRouter)
app.use("/api/ai", aiRouter) 

socketHandler(io)
server.listen(port,()=>{
    connectDb()
    console.log(`server started at ${port}`)
})