import { sendResponse, handleCustomThrow } from '../../utils/sendResponse';
import { Saving, Task, Transaction, Education } from "../../models";

/*
It will get all the dashboard data of the user
*/
export const childDashboard = async (req, res) => {
    try {
        let savingData = await Saving.find({ childId: req.user._id, status: { $in: ['1', '2'] } })
            .sort({ 'createdAt': -1 })
            .limit(3)

        let taskData = await Task.find({ childId: req.user._id, specialBonus: true, isDeleted: false })
            .sort({ 'createdAt': -1 })
            .limit(3)
            .populate('category')

        let educationData = await Education.find({ status: '1' })
            .sort({ 'createdAt': -1 })
            .limit(3)
        sendResponse(
            res,
            200,
            { savingData, taskData, educationData },
            "Dashboard Data"
        )
    } catch (error) {
        handleCustomThrow(res, error)
    }
}

/*
    It will get gall the child earnings 
*/
export const childEarnigs = async (req, res) => {
    try {
        let txtData
        let taskCount
        if (req.query.childId) {
            txtData = await Transaction.find({ "toUserId": req.query.childId })
            taskCount = await Task.find({ childId: req.query.childId, status: { $in: ['3', '4'] }, isDeleted: false }).count()
        } else {
            txtData = await Transaction.find({ "toUserId": req.user._id })
            taskCount = await Task.find({ childId: req.user._id, status: { $in: ['3', '4'] }, isDeleted: false }).count()
        }

        sendResponse(
            res,
            200,
            { txtData, taskCount },
            "Dashboard Data"
        )
    } catch (error) {
        handleCustomThrow(res, error)
    }
}