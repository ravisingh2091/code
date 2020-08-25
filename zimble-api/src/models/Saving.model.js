import mongoose from '../db';

const SavingSchema = new mongoose.Schema({
    childId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        index: true
    },
    image: {
        type: String,
    },
    wishlistName: {
        type: String,
        trim: true,
        index: true,
        required: true
    },
    amountNeeded: {
        type: Number,
        required: true
    },

    amountSave: {
        type: Number,
        default: 0
    },
    favorite: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['0', '1', '2'], // 0 inactive  , 1 = active , 2 complete   
        default: '1'
    }

}, { timestamps: true });

module.exports = mongoose.model('Savings', SavingSchema);