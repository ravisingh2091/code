
import mongoose from '../db';

const TransactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    transactionId: {
        type: String,
        trim: true,
        index: true,
        required: true
    },
    amount: {
        type: String,
        trim: true,
        index: true,
        required: true
    },
    description: {
        type: String,
        trim: true,
        index: true,
        required: true
    },
    type: {
        type: Number
    }
}, { timestamps: true });




module.exports = mongoose.model('StripeTransactions', TransactionSchema);







