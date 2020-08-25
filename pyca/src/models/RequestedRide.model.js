import mongoose from '../db';
const RequestedRideSchema = new mongoose.Schema({

    requestedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        index: true,
        required: true
    },
    fromPoint: {
        type: { type: String, default: 'Point', enum: ['Point'] },
        coordinates: [{ type: Number, createIndexes: true }],   // phli key lat dushri long
    },
    fromPointName: {
        type: String,
        required: true
    },
    goingToPoint: {
        type: { type: String, default: 'Point', enum: ['Point'] },
        coordinates: [{ type: Number, createIndexes: true }],   // phli key lat dushri long
    },
    goingToPointName: {
        type: String,
        required: true
    },
    dateTimeMilliSecond: {
        type: Number,
        required: true
    },
    dateAndTime: {
        type: Date,
        required: true
    },
    offeredById: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        index: true,
        required: true
    },
    offeredId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OfferRides',
        index: true,
        required: true
    },
    seatRequired: {
        type: Number,
        required: true
    },
    youthId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Youths',
        index: true,
        required: true
    }],
    rideStatus: {
        type: String,
        enum: ['0', '1', '2', '3', '4'],// 0 requested, 1 accepted, 2 picked, 3 cancel, 4 complete
        default: '0'
    },

}, { timestamps: true });

RequestedRideSchema.index({ fromPoint: '2dsphere' });
RequestedRideSchema.index({ goingToPoint: '2dsphere' });

module.exports = mongoose.model('RequestedRides', RequestedRideSchema);






