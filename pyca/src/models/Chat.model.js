import mongoose from '../db';

const ChatSchema = new mongoose.Schema({
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        trim: true
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
    message: {
        type: String,
        trim: true
    },
    messageType: {
        type: String,
        enum: ['text', 'file'],
        default: 'text'
    },
    status: {
        type: String,
        enum: ['seen', 'unseen'],
        default: 'seen'
    }
}, { timestamps: true });

module.exports = mongoose.model('Chats', ChatSchema);


