import mongoose from '../db';

const Review = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    rating: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['0', '1'],
        default: '0'
    }
}, { timestamps: true });

module.exports = mongoose.model('Reviews', Review);







