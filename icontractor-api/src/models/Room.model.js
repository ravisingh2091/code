import mongoose from '../db';

const RoomSchema = new mongoose.Schema({
    name: { type: String, trim: true, required: true },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    window: { type: Number, required: true },
    doneStatus: { type: Boolean, default: false }
}, { timestamp: true });

module.exports = mongoose.model('Rooms', RoomSchema);






