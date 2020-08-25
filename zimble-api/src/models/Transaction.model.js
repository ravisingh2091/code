
import mongoose from '../db';

const TransactionSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    toUserId: {
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
        type: Number,
        trim: true,
        index: true,
        required: true
    },

    message: {
        type: String,
        trim: true,
    },
    type: {
        type: String,
        trim: true,
        index: true,
        required: true
    }
}, { timestamps: true });


// 0 = Transfer from credit/debit card to wallet; 
// 1 = Transfer from wallet to card; 
// 2 = Transfer from wallet to saving;
// 3 = Transfer from card to saving;
// 4 = Transfer from saving to card; 
// 5 = Transfer from this user to other user;
// 6 = pocket
// 7 = top up from bank 
// 8 = top up from credit 
// 9 = Transfer from card to wallet 
// 10 = Transfer from wallet to wallet 
// 11 = Purchase/spend by card 
// 12 = Reward from system
// 13 = remove child charge
// 14 = dispute fee

module.exports = mongoose.model('Transactions', TransactionSchema);







