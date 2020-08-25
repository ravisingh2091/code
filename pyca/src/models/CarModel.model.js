import mongoose from '../db';

const CarSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    status: {
        type: String,
        enum: ['0', '1'],
        default: '1'
    },
}, { timestamps: true });




module.exports = mongoose.model('CarModels', CarSchema);






