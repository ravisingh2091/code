import mongoose from '../db';
import { decrypt } from '../utils/encryptDecrypt';

const CardSchema = new mongoose.Schema({
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
        index: true
    },
    cardHolderName: {
        type: String,
        required: true,
        trim: true
    },
    cardNumber: {
        type: String,
        required: true,
        trim: true
    },
    expDate: {
        type: String,
        required: true,
        trim: true
    },

    cvv: {
        type: String,
        required: true,
        trim: true
    }

}, { timestamps: true });
CardSchema.methods.toJSON = function () {
    const card = this;
    const cardObject = card.toObject()

    cardObject.cardHolderName = decrypt(cardObject.cardHolderName)
    cardObject.expDate = decrypt(cardObject.expDate)
    cardObject.cardNumber = decrypt(cardObject.cardNumber).slice(-4)
    delete cardObject.cvv
    return cardObject
}

module.exports = mongoose.model('Cards', CardSchema);
