import mongoose from '../db';

const ProjectSchema = new mongoose.Schema({
    name: { type: String, trim: true, required: true },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    bedRooms: { type: Number, required: true },
    bathRooms: { type: Number, required: true },
    masterBedRooms: { type: Number, required: true },
    masterBaths: { type: Number, required: true },
    livingRooms: { type: Number, required: true },
    diningRooms: { type: Number, required: true },
    kitchens: { type: Number, required: true },
    offices: { type: Number, required: true },
    garages: { type: Number, required: true },
    other: { type: Number, required: true },
    doneStatus: { type: Boolean, default: false }
}, { timestamp: true });

module.exports = mongoose.model('Projects', ProjectSchema);






