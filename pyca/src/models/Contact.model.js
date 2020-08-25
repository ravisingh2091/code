import mongoose from '../db';

const contactSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        index: true
    },
    reason: {
        type: String,
        trim: true,
        required: true,
        index: true,
        lowercase: true,
    },
    email: {
        type: String,
        trim: true,
        required: true
    },
    message: {
        type: String,
        trim: true,
        required: true
    },
}, { timestamps: true })

module.exports = mongoose.model('Contact', contactSchema)