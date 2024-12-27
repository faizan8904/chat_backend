import express from 'express'
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"
import { app,server } from './lib/socket.js'

//routes
import authRoutes from "./routes/auth.routes.js"
import messageRoute from "./routes/message.routes.js"
import { connectDB } from './lib/db.js'


dotenv.config()
const PORT = process.env.PORT || 8000

//built in middleware
app.use(express.json({ limit: '10mb' })) // get json on request
app.use(cookieParser()); // get cookie on request
app.use(cors({
    origin:"http://localhost:5173",
    credentials: true,
}))

//custom routes 
app.use("/api/auth",authRoutes)
app.use("/api/messages",messageRoute)





//port
server.listen(PORT,()=>{
    console.log("server is running "+PORT);
    connectDB();
})