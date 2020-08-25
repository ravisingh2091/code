import mongoose from '../db';

const Education = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true
    },
    preview: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    topic: [{
        name: {
            type: String,
            trim: true,
        },
        icon: {
            type: String
        },
        type: {
            type: String,
            enum: ['0', '1', '2'], // 0 new ,1 recommended , 2 Hot
        },
        status: {
            type: String,
            default: '1',
            enum: ['0', '1', '2']  // 0 inactive ,1 active , 2 delete
        }
    }],
    favoriteBy: [{
        childId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users',
            index: true
        },
    }],
    status: {
        type: String,
        default: '1',
        enum: ['0', '1', '2']  // 0 inactive ,1 active , 2 delete
    }
}, { timestamps: true });


module.exports = mongoose.model('Educations', Education);



