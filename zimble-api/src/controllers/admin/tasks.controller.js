import { } from './_requestValidators';
import { sendResponse, handleCustomThrow } from '../../utils/sendResponse';
import { Task } from '../../models'

// this function is used to list the task
export const listTask = async (req, res) => {
    try {
        let query = req.query;
        let criteria
        if (query.userType === 'parent') {
            criteria = {
                isDeleted: false,
                parentId: query.userId
            }
        } else if (query.userType === 'child') {
            criteria = {
                isDeleted: false,
                childId: query.userId
            }
        } else {
            criteria = { isDeleted: false }
        }

        let tasklist = await Task.find(criteria, {
            category: 1,
            childId: 1,
            taskName: 1,
            monetaryReward: 1,
            createdAt: 1,
            rewardAmount: 1,
        }).sort({ 'createdAt': -1 })
            .populate([
                {
                    path: 'category',
                    select: 'name'
                },
                {
                    path: 'childId',
                    select: 'firstName lastName'
                }
            ]);
        sendResponse(
            res,
            200,
            tasklist,
            "TaskList list"
        )
    } catch (error) {
        return handleCustomThrow(res, error);
    }
}

// this function is used to show the details  task
export const taskDetail = async (req, res) => {
    try {

        let criteria = { _id: req.params.id }


        let tasklist = await Task.findOne(criteria).sort({ 'createdAt': -1 })
            .populate([
                {
                    path: 'category',
                    select: 'name'
                },
                {
                    path: 'childId',
                    select: 'firstName lastName'
                }
            ]);
        sendResponse(
            res,
            200,
            tasklist,
            "TaskList list"
        )
    } catch (error) {
        return handleCustomThrow(res, error);
    }
}