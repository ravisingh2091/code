import mongoose from '../db';

var OtpSchema = new mongoose.Schema({
    email: { type: String, required: true, trim: true, lowercase: true },
    otp: Number,
}, { timestamps: true });

module.exports = mongoose.model('Otp', OtpSchema);
