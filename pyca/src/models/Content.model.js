import mongoose from '../db';

const contentSchema = new mongoose.Schema({
    type: {
        type: String,
        trim: true,
        required: true,
        index: true,
        lowercase: true,
    },
    title: {
        type: String,
        trim: true,
        required: true
    },
    content: {
        type: String,
        trim: true,
        required: true
    },
}, { timestamps: true })

module.exports = mongoose.model('Contents', contentSchema)