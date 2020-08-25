
import bcrypt from 'bcrypt';
import mongoose from '../db';
import { PASS_HASH_ROUNDS } from '../config';

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
    phone: {
        type: String,
        trim: true,
        unique: true,
        required: true,
        index: true
    },
    userToken: {
        type: String
    },
    address: {
        type: String,
        trim: true
    },
    zipCode: {
        type: String,
        trim: true
    },
    carModel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CarModels',
        index: true
    },
    vehicleNumber: {
        type: String,
        trim: true,
        index: true,
        lowercase: true,
    },
    deviceType: {
        type: String,
        enum: ['android', 'ios']
    },
    status: {
        type: String,
        enum: ['0', '1'],   // 0 inactve 1 active 
        default: '1'
    },

    adminApproved: {
        type: String,
        enum: ['0', '1'],   // 0 inactve 1 active 
        default: '1'
    },
    deviceToken: {
        type: String
    },
    location: {
        type: { type: String, default: 'Point', enum: ['Point'] },
        coordinates: [{ type: Number, createIndexes: true }],   // phli key long dushri lat
    },
    availability: {
        type: Boolean,
        default: true
    },
    notification: {
        type: Boolean,
        default: true
    },
    image: {
        type: String,
        default: 'https://petparenting-node.s3.ap-south-1.amazonaws.com/user/1581689853493-profile_pic.png'
    },
    connectedMember: [
        {
            memeberId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Users',
                index: true
            }
        }
    ]
});

UserSchema.index({ location: '2dsphere' });

UserSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject()
    delete userObject.password
    return userObject
}


UserSchema.pre('save', function (next) {
    const user = this;

    if (user.isModified('password')) {
        bcrypt.genSalt(PASS_HASH_ROUNDS, (err, salt) => {

            if (err) {
                throw err;
            }
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});



module.exports = mongoose.model('Users', UserSchema);






