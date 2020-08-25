import mongoose from '../db';

const Chat = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
        index: true
    },
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Events',
        index: true
    },
    approveStatus: {
        type: String,
        enum: ['0', '1', '2', '3'],  // 0=pending, 1=accept, 2=accept with conditions ,3 reject
        default: '0'
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
        index: true
    },
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        index: true
    },
    message: {
        type: String
    },
    messageType: {
        type: String
    },
    readStatus: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });


module.exports = mongoose.model('Chats', Chat);



