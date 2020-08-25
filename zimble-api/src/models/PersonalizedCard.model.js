
import mongoose from '../db';

const PersonalizedCardSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        index: true,
        required: true
    },
    code: {
        type: String,
        trim: true,
        index: true,
        required: true
    },
    image: {
        type: String,
        trim: true,
        index: true,
        required: true
    },
    status: {
        type: String,
        enum: ['0', '1'],  // 0 inactive 1 active
        default: '0'
    },

}, { timestamps: true });




module.exports = mongoose.model('PersonalizedCards', PersonalizedCardSchema);







