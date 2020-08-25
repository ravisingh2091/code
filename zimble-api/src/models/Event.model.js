import mongoose from '../db';

const EventSchema = new mongoose.Schema({
    childId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    eventName: {
        type: String,
        trim: true,
        index: true,
        required: true
    },
    eventDescription: {
        type: String,
        trim: true,
        index: true,
        required: true
    },
    location: {
        type: String,
        trim: true,
        index: true,
        required: true
    },
    locationLatLong: {
        type: { type: String, default: 'Point', enum: ['Point'] },
        coordinates: [{ type: Number, createIndexes: true }],   // phli key lat dushri long
    },
    eventTimeDate: {
        type: Number,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    approveStatus: {
        type: String,
        enum: ['0', '1', '2', '3'],  // 0=pending, 1=accept, 2=accept with conditions ,3 reject
        default: '0'
    }

}, { timestamps: true });

EventSchema.index({ locationLatLong: '2dsphere' });
module.exports = mongoose.model('Events', EventSchema);