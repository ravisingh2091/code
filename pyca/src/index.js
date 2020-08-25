import express from 'express';

import bodyParser from 'body-parser';
import cors from 'cors';
import expressValidator from 'express-validator';
import fileUpload from 'express-fileupload'
import SocketIO from "socket.io"
import http from "http"

const app = express();
const server = http.Server(app);
const io = SocketIO(server);

import { sendResponse } from './utils/sendResponse';
import apiRoutes from './routes';
import './db';
import {
    roomJoin,
    onMessage,
    getRoom,
    roomLeave
} from "./controllers/chat";




app.disable('x-powered-by');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(
    expressValidator({
        customValidators: {
            isDate: value => !isNaN(Date.parse(value))
        }
    })
);
app.use(fileUpload());

app.use((req, res, next) => {
    console.log({
        URL: req.url,
        body: req.body,
        date: new Date()
    })
    next();
})

// Routes
app.use('/', apiRoutes);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('URL Not Found');
    sendResponse(res, 404, {}, err.message);
    next();
});

const { PORT = 4000 } = process.env;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`)); // 
server.listen(4001, () => console.log(`Chat Listening on port 4001`)); // eslint-disable-line no-console



io.on('connection', (socket) => {
    console.log('--------------------->connected', socket.id);

    //Get user room id
    socket.on("get_user_room", (msg) => {
        console.log('------------------------->get_user_room', { msg })
        getRoom(socket, msg)
    })

    // Join the room
    socket.on("room_join", (msg) => {
        console.log('------------------------->room_join', { msg })
        roomJoin(socket, io, msg)
    })

    // Join the room leave
    socket.on("room_leave", (msg) => {
        console.log('------------------------->room_leave', { msg })
        roomLeave(socket, io, msg)
    })

    // on message send
    socket.on("message", (msg) => {
        console.log('------------------------->message', { msg })
        onMessage(socket, io, msg)
    })
    // on track send
    socket.on("track", (msg) => {
        console.log('------------------------->message', { msg })
        io.in(msg.room_id).emit("track", msg)
    })

    // disconnect 
    socket.on('disconnect', () => {
        console.log('--------------------------->user disconnected', socket.id);
    });

});