
import mongoose from '../db';

const TaskSchema = new mongoose.Schema({
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true, index: true },
    childId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', index: true },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Events' },
    taskName: { type: String, trim: true, index: true, required: true },
    taskDescription: { type: String, trim: true, index: true, required: true },
    // category: { type: mongoose.Schema.Types.ObjectId, ref: 'Categories', index: true, required: true },
    imageUrls: { type: Array },
    videoUrls: { type: Array },
    notInterestedChildren: [{ childId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', } }],
    notifyType: { type: String, enum: ['all', 'single'], default: 'all' },
    dueDate: { type: Date },
    dueDays: { type: Number },
    reward: { type: String, trim: true, },
    monetaryReward: { type: Boolean, default: false },
    rewardAmount: { type: Number },
    bonusReward: { type: Boolean, default: false },
    bonusRewardDesc: { type: String, trim: true, },
    bonusMonetry: { type: Boolean, default: false },
    bonusAmount: { type: Number },
    specialBonus: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    repeat: {
        type: String,
        default: '0',
        enum: ['0', '1', '2', '3'], // 0 no  ,1= daily, 2 = weekly , 3=monthly 
    },
    status: {
        type: String,
        default: '0',
        enum: ['0', '1', '2', '3', '4', '5'], // 0 pending  ,1= accept, 2 = submit , 3=complete, 4=reward send,5=reject 
    },
}, { timestamps: true });




module.exports = mongoose.model('Tasks', TaskSchema)