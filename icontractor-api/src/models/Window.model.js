import mongoose from '../db';

const WindowSchema = new mongoose.Schema({
    name: { type: String, trim: true, required: true },
    width: { type: String, required: true },
    height: { type: String, required: true },
    features: { type: Array, required: true },
    note: { type: String, required: true },
    image: { type: Array, required: true },
    openingUnit: {
        type: String,
        enum: ['1', '2', '3', '4'],
        required: true
    },
    shape: {
        type: String,
        enum: ['singleHung', 'doubleHung', 'sliding', 'picture', 'awning', 'bay', 'casement', 'specialShape'],
    },
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    estimitatedPrice: { type: Number }
}, { timestamp: true });

module.exports = mongoose.model('Windows', WindowSchema);

/*  shape
1 = Single-Hung
2 = Double-Hung
3 = Sliding
4 = Picture
5 = Awning
6 = Bay
7 = Casement
8 = Special Shape
*/





