import mongoose from '../db';
const ScheduleSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        index: true
    },
    youthId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Youths',
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
    dayName: {
        type: Array,
        required: true
    },
    status: {
        type: String,
        enum: ['0', '1'],   // 0 inactve 1 active 
        default: '1'
    },

}, { timestamps: true });

ScheduleSchema.index({ fromPoint: '2dsphere' });
ScheduleSchema.index({ goingToPoint: '2dsphere' });

module.exports = mongoose.model('Schedules', ScheduleSchema);
