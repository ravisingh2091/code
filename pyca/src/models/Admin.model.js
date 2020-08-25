import mongoose from '../db';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        lowercase: true,
        trim: true,
        required: true,
        index: true
    },
    password: {
        type: String,
        required: true
    },

    adminToken: {
        type: String
    },
    status: {
        type: String,
        enum: ['0', '1'],   // 0 inactve 1 active 
        default: '1'
    },
    image: {
        type: String,
        default: 'https://petparenting-node.s3.ap-south-1.amazonaws.com/user/1581689853493-profile_pic.png'
    }
});




module.exports = mongoose.model('Admins', UserSchema);






