import express from 'express';
import SocketIO from "socket.io"
import http from "http"
import './db';
import { Chat, User } from "./models";
import { pushNotify } from './utils/notification';

const app = express();
const server = http.Server(app);
const io = SocketIO(server);

server.listen(4000, () => {
  console.log('Chat server running on port 4000');
});

app.all('/*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Key, Authorization");
  res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE, PATCH");
  next()
});


//////////////////// CHAT MODELS start ///////////////////////
io.on('connection', (socket) => {

  socket.on('room join', async (msg) => {
    socket.join(msg.roomId, () => {
      io.to(msg.roomId).emit('room join', { status: true, roomId: msg.roomId, senderId: msg.senderId });
    });
    await User.updateOne({ _id: msg.senderId }, { $set: { "onlineStatus": true } })
  });

  socket.on('room leave', async (msg) => {
    socket.leave(msg.roomId, () => {
      io.to(msg.roomId).emit('room leave', { status: true, roomId: msg.roomId, senderId: msg.senderId });
    });

    await User.updateOne({ _id: msg.senderId }, { $set: { "onlineStatus": false } })
  })


  socket.on('message', (msg) => {
    if (msg.roomId && msg.message && msg.senderId && msg.receiverId) {
      let message = msg;
      message.createdAt = new Date().toISOString();
      message.readStatus = false;
      message.status = true;
      io.to(msg.roomId).emit('message', message);
      new Chat({
        senderId: msg.senderId,
        receiverId: msg.receiverId,
        roomId: msg.roomId,
        message: msg.message,
        messageType: msg.messageType
      }).save()
        .then(async (result) => {
          let userData = await User.findOne({ _id: msg.receiverId, onlineStatus: false })
          if (userData) {
            let pushData = {
              data: {
                title: "New message",
                body: msg.message,
                type: "chat",
                roomId: msg.roomId.toString(),
                senderId: msg.senderId.toString(),
                receiverId: msg.receiverId.toString()
              },
              token: userData.deviceToken
            }
            if (userData.deviceToken) {
              pushNotify(pushData)
            }
          }


        }, error => {
          console.log({ error })
        })
    } else {
      io.to(msg.roomId).emit('message', { status: false, message: 'wrong data' });

    }
  });



  // disconnect
  socket.on('disconnect', () => {
    console.log('--------------------------->user disconnected', socket.id);
  });
})



export const addEventChart = (item) => {
  io.to(item.roomId).emit('message', item);
}