import { Room, Chat, User } from '../../models';
import { pushNotify } from '../../utils/notification';

export const getRoom = async (socket, data) => {
    try {
        if (data.senderId && data.receiverId) {
            var roomCriteria = {
                $or: [{
                    $and: [{
                        "senderId": data.senderId
                    }, {
                        "receiverId": data.receiverId
                    }]
                }, {
                    $and: [{
                        "receiverId": data.senderId
                    }, {
                        "senderId": data.receiverId
                    }]
                }]
            }
            let room = await Room.findOne(roomCriteria)
            if (room) {
                socket.emit('get_user_room', { status: true, room_id: room._id });
                console.log("----------------------> after emmit get_user_room", { status: true, room_id: room._id })
            } else {
                let roomjson = new Room({
                    "senderId": data.senderId,
                    "receiverId": data.receiverId
                });

                await roomjson.save();
                socket.emit('get_user_room', { status: true, room_id: roomjson._id });
                console.log("----------------------> after emmit get_user_room", { status: true, room_id: roomjson._id })
            }


        } else {
            socket.emit('get_user_room', { status: false, message: "Invalid/Missing data" });
            console.log("----------------------> after emmit get_user_room", { status: false, message: "Invalid/Missing data" })
        }

    } catch (error) {
        console.log(error)
    }
}

export const roomJoin = (socket, io, msg) => {
    if (msg.room_id) {
        socket.join(msg.room_id, () => {
            io.in(msg.room_id).emit("room_join", { status: true, msg: "room join", room_id: msg.room_id })
            console.log("----------------------> after emmit room_join", { status: true, msg: "room join", room_id: msg.room_id })
        })

    } else {
        socket.emit('room_join', { status: false, message: "Invalid/Missing data" });
        console.log("----------------------> after emmit room_join", { status: false, message: "Invalid/Missing data" })
    }
}

export const roomLeave = (socket, io, msg) => {
    if (msg.room_id) {
        socket.leave(msg.room_id, () => {
            io.in(msg.room_id).emit("room_leave", { status: true, msg: "room leave", room_id: msg.room_id })
            console.log("----------------------> after emmit room_leave", { status: true, msg: "room leave", room_id: msg.room_id })
            return
        })
    } else {
        socket.emit('room_leave', { status: false, message: "Invalid/Missing data" });
        console.log("----------------------> after emmit room_leave", { status: false, message: "Invalid/Missing data" })
    }

}

export const onMessage = async (socket, io, msg) => {
    try {
        if (msg.room_id && msg.chat && msg.senderId && msg.receiverId) {

            let chatData = {
                roomId: msg.room_id,
                senderId: msg.senderId,
                receiverId: msg.receiverId,
                message: msg.chat,
                messageType: 'text',
                status: 'unseen',
                createdAt: new Date().toISOString()
            }

            io.in(msg.room_id).emit("message", { status: true, chatData })
            console.log("----------------------> after emmit message", { status: true, chatData })
            delete (chatData.createdAt)
            await new Chat(chatData).save()
            await Room.updateOne({ _id: msg.room_id }, { lastMessage: msg.chat })

            let receiver = await User.findOne({ _id: msg.receiverId })

            let pushData = {
                data: {
                    title: "New Message",
                    body: msg.chat,
                    type: "chat",
                    id: msg.room_id
                },
                token: receiver.deviceToken
            }
            if (receiver.notification) {
                pushNotify(pushData)
            }
        } else {
            socket.emit('message', { status: false, message: "Invalid/Missing data" });
            console.log("----------------------> after emmit message", { status: false, message: "Invalid/Missing data" })
        }

    } catch (error) {
        console.log(error)
    }
}