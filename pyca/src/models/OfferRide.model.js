import mongoose from '../db';
const OfferRideSchema = new mongoose.Schema({
    offeredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        index: true
    },
    fromPoint: {
        type: { type: String, default: 'Point', enum: ['Point'] },
        coordinates: [{ type: Number, createIndexes: true }],   // phli key long dushri lat
    },
    fromPointName: {
        type: String,
        required: true
    },
    goingToPoint: {
        type: { type: String, default: 'Point', enum: ['Point'] },
        coordinates: [{ type: Number, createIndexes: true }],   // phli key long dushri lat
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
    availableSeat: {
        type: Number,
        required: true
    },
    rideStatus: {
        type: String,
        enum: ['0', '1', '2'],// 0 schedule , 1 ongoing, 2 complete
        default: '0'
    },
    status: {
        type: String,
        enum: ['0', '1'],   // 0 inactve 1 active 
        default: '1'
    },

}, { timestamps: true });

OfferRideSchema.index({ fromPoint: '2dsphere' });
OfferRideSchema.index({ goingToPoint: '2dsphere' });

module.exports = mongoose.model('OfferRides', OfferRideSchema);






