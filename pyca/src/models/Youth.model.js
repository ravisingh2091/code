import mongoose from '../db';

const youthSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        index: true
    },
    name: {
        type: String,
        trim: true,
        required: true,
        index: true,
        lowercase: true,
    },
    dob: {
        type: String,
        trim: true,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    relation: {
        type: String,
        trim: true,
        required: true,
        lowercase: true,
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        required: true
    },
    image: {
        type: String,
        default: 'https://petparenting-node.s3.ap-south-1.amazonaws.com/user/1581689853493-profile_pic.png'
    }
}, { timestamps: true })

module.exports = mongoose.model('Youths', youthSchema)