import bcrypt from 'bcrypt';
import mongoose from '../db';
import { PASS_HASH_ROUNDS } from '../config';

const UserSchema = new mongoose.Schema({
    email: { type: String, unique: true, lowercase: true, trim: true, required: true, index: true },
    password: { type: String },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', index: true },
    referalBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', index: true },
    firstName: { type: String, trim: true, index: true },
    lastName: { type: String, trim: true, index: true },
    familyName: { type: String, trim: true, index: true },
    nationality: { type: String },
    age: { type: Number },
    phone: { type: String, trim: true, index: true },
    matchmoveId: { type: String, trim: true, index: true },
    matchmoveWalletId: { type: String, trim: true, index: true },
    matchMovePassword: { type: String, trim: true, index: true },
    matchMoveWalletCard: { type: String, trim: true, index: true },
    matchmoveCardKit: { type: String },
    matchmoveActivationCode: { type: String },
    totalWallet: { type: Number },
    totalCardBalance: { type: Number },
    deviceType: { type: String, enum: ['', 'android', 'ios'] },
    deviceToken: { type: String, index: true },
    userToken: { type: String, index: true },
    profilePicture: { type: String, default: 'https://petparenting-node.s3.ap-south-1.amazonaws.com/user/1581689853493-profile_pic.png' },
    coverPicture: { type: String, default: 'https://petparenting-node.s3.ap-south-1.amazonaws.com/user/1581689853493-profile_pic.png' },
    gender: { type: String, enum: ['male', 'female'], index: true },
    dob: { type: String },
    personisalizedCardId: { type: mongoose.Schema.Types.ObjectId, ref: 'PersonalizedCards', index: true },
    otpData: { otp: { type: Number }, createdAt: { type: Date } },
    ipinOtp: { otp: { type: Number }, createdAt: { type: Date } },
    emailUrl: { url: { type: String, index: true }, createdAt: { type: Date, } },
    referalCode: { type: String, lowercase: true },
    allowanceDate: { type: Date, index: true },
    allowanceAutoMode: { type: Boolean },
    allowanceAmountLimit: { type: Number },
    spendLimit: { type: Number }, // monthly spend limit
    useSpendLimit: { type: Number }, // how much spend in month
    weeklySpendLimit: { type: Number },
    weeklySavingTarget: { type: Number },
    address: {
        address_1: { type: String, trim: true },
        address_2: { type: String, trim: true },
        city: { type: String, trim: true },
        state: { type: String, trim: true },
        country: { type: String, trim: true },
        countryCode: { type: String, trim: true },
        postalCode: { type: String }
    },
    stripe: {
        customerId: { type: String }
    },
    subscription: {
        numberOfChild: { type: Number },
        planId: { type: String },
        subscriptionId: { type: String },
        renew: { type: Number },
        expiry: { type: Number },
        status: {
            type: String,
            enum: ['0', '1'],  // 0 = inactive , 1 = active
            default: '0'
        },
    },
    notification: { type: Boolean, default: true },
    ipinSet: { type: Boolean, default: false },
    userType: {
        type: String, default: '1', required: true, index: true,
        enum: ['0', '1'] // 0 child 1 parent
    },
    cardActiveStatus: {
        type: String, default: '0',
        enum: ['0', '1'], // 0 not varified 1 varified 
    },
    temporaryCardStatus: {
        type: String, default: '0',
        enum: ['0', '1'], // 0 block 1 unblock 
    },
    cardDeleteRequest: {
        type: String, default: '0',
        enum: ['0', '1'], // 0 not 1 yes 
    },
    status: {
        type: String, default: '0',
        enum: ['0', '1', '2'] // 0 inactive 1 active 2 delete
    },
    cashWithdrawal: {
        type: String, default: '1',
        enum: ['0', '1'],   // 0 inactve 1 active 
    },
    phoneOtpStatus: {
        type: String, default: '0',
        enum: ['0', '1'], // 0 not varified 1 varified 
    },
    emailVerifyStatus: {
        type: String, default: '0',
        enum: ['0', '1'], // 0 not varified 1 varified 
    },
    onlineStatus: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

UserSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject()
    delete userObject.password
    return userObject
}

UserSchema.statics.findByCredentials = function (email, password) {
    let User = this;
    email = email.toLowerCase()
    return User.findOne({ email }).then(user => {
        if (!user) {
            return Promise.reject({
                code: 404,
                msg: 'Invalid email, user not found'
            });
        }
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if (res) {
                    resolve(user._doc);
                } else {
                    reject({ code: 401, msg: 'It seems that you have entered wrong credentials.' });
                }
            });
        });
    });
};

UserSchema.pre('save', function (next) {
    const user = this;
    if (user.isModified('password')) {
        bcrypt.genSalt(+PASS_HASH_ROUNDS, (err, salt) => {
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