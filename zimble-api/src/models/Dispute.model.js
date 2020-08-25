import mongoose from '../db';

const DisputeSchema = new mongoose.Schema({
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
        index: true
    },
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admins',
        required: true,
        index: true
    },
    amount: {
        type: Number,
        required: true
    },
    disputeId: {
        type: String,
        required: true
    },
    disputeTxtId: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });

module.exports = mongoose.model('Disputes', DisputeSchema);
