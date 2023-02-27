import express from "express";
import cors from "cors";
import morgan from "morgan";
import http from "http"
import 'dotenv/config'
import  {Server}  from "socket.io";
import mongoose from 'mongoose'
import createHttpError, { isHttpError } from 'http-errors';
import playerRoute from "./router/playerRouter.mjs"
import adminRoute from "./router/adminRouter.mjs";
import scoutRoute from "./router/scoutrouter.mjs";
const app = express();
//..................................................................................................//
//server

const server=http.createServer(app);
app.use(express.json());
app.use(cors())
app.use(morgan('tiny'));
app.disable('x-powered-by'); //less hackers know about our stack 

//API starting point for Admin,player,scout

app.use('/api', playerRoute)
app.use('/api/scout', scoutRoute)
app.use('/api/admin', adminRoute)

// error handiling  

app.use((req, res, next) => {
    next(createHttpError(404, "Endpoint not found"))
})
app.use((error, req, res, next) => {
    console.log(error);
    let errorMessage = "An unknown error occured "
    let statusCode = 500;
    if (isHttpError(error)) {
        statusCode = error.status;
        errorMessage = error.message;
    }
    res.status(statusCode || 500).json({ error: errorMessage || "unknown error" })
})


//..........................................................................//
// SocketIO

const io = new Server(server,{
    cors: {
        origin:"*",
        credentials: true
    } 
});

const onlineUsers = new Map();
io.on("connection", (socket) => { 
    console.log('Client connected:', socket.id);
    // const chatSocket = socket;
    socket.on("addUser", (id) => {
        onlineUsers.set(id, socket.id);
    })
    socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.to)
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-receive", data.message)
        }
    })
    
// Handle disconnections

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
})

//  start server only when we have valid connections

const port = process.env.PORT
mongoose.connect(process.env.MONGO_CONNECTION).then(() => {
    try {
        server.listen(port, () => {
            console.log(`server&database connected to http://localhost:${port}`);
        })
    } catch (error) {
        console.log('connot connect to the server');
    }
}).catch(error => {
    console.log('Invalid Database Connection...!')
})


