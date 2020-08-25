import mongoose from '../db';

const Category = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['0', '1'],
        default: '1'
    }
}, { timestamps: true });

module.exports = mongoose.model('Categories', Category);







