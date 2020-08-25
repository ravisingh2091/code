
import mongoose from '../db';

const NotificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    id: {
        type: String,
        trim: true,
        index: true
    },
    title: {
        type: String,
        trim: true,
        index: true,
        required: true
    },
    message: {
        type: String,
        trim: true,
        index: true,
        required: true
    },
    type: {
        type: String,
        trim: true,
        index: true,
        required: true
    },
    status: {
        type: String,
        enum: ['0', '1'],
        default: '0'
    }
}, { timestamps: true });




module.exports = mongoose.model('Notifications', NotificationSchema);







