
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
    otpData: {
        otp: { type: Number },
        createdAt: { type: Date }
    },
    userToken: {
        type: String
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
    deviceToken: {
        type: String
    },
    location: {
        type: { type: String, default: 'Point', enum: ['Point'] },
        coordinates: [{ type: Number, createIndexes: true }],   // phli key long dushri lat
    },
    notification: {
        type: Boolean,
        default: true
    }
}, { timestamp: true });

UserSchema.index({ location: '2dsphere' });



UserSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject()
    delete userObject.otpData
    return userObject
}


module.exports = mongoose.model('Users', UserSchema);






