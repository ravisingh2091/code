
import bcrypt from 'bcrypt';
import mongoose from '../db';
import { PASS_HASH_ROUNDS } from '../config';

const ContractorSchema = new mongoose.Schema({
    firstName: {
        type: String,
        trim: true,
        required: true
    },
    lastName: {
        type: String,
        trim: true,
        required: true
    },
    companyName: {
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
        index: true
    },
    userToken: {
        type: String
    },
    other: {
        type: String,
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    radius: {
        type: Number,
        trim: true,
        index: true,
    },
    location: {
        type: { type: String, enum: ['Point'] },
        coordinates: [{ type: Number, createIndexes: true }],   // phli key long dushri lat
    },
    emailUrl: { url: { type: String, index: true }, createdAt: { type: Date, } },
    status: {
        type: String,
        enum: ['0', '1', '2'],   // 0 inactve 1 active 2 terminate
        default: '1'
    },
    deviceToken: {
        type: String
    },

}, { timestamp: true });

ContractorSchema.index({ location: '2dsphere' });

ContractorSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject()
    delete userObject.password
    return userObject
}


ContractorSchema.pre('save', function (next) {
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

module.exports = mongoose.model('Contractors', ContractorSchema);