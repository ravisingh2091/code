import mongoose from '../db';

const UserSchema = new mongoose.Schema({
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
    lastMessage: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Rooms', UserSchema);


