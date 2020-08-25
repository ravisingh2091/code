import {
    validateAddTaskPayload,
    validateAcceptTask,
    validateRewardSend
} from './_requestValidators';
import { sendResponse, handleCustomThrow } from '../../utils/sendResponse';
import { processTransferFromWalletToCard, getWalletCard } from '../../utils/matchMove';
import { Task, User, Notification, Transaction } from "../../models";
import { pushNotify } from '../../utils/notification';
import mongoose from '../../db';

// This function is used to add the task into the database
export const addTask = async (req, res) => {
    try {
        const errors = validateAddTaskPayload(req);
        if (errors) {
            return sendResponse(res, 400, {}, errors[0].msg);
        }
        let dataToSave = req.body

        if (dataToSave.childArray.length == 1) {
            dataToSave.childId = dataToSave.childArray[0]
            dataToSave.notifyType = 'single'
        }

        dataToSave.parentId = req.user._id;
        let task = await (new Task(dataToSave).save())

        sendResponse(
            res,
            200,
            task,
            "Task Added Successfully"
        )

        if (dataToSave.childArray.length == 1) {
            let user = await User.findOne({ _id: dataToSave.childArray[0] })

            let pushData = {
                data: {
                    title: "Hey! You have assigned a new task - " + dataToSave.taskName,
                    body: dataToSave.taskDescription,
                    type: "single_task",
                    taskId: task._id.toString()
                },
                token: user.deviceToken
            }

            let notification = {
                title: "Hey! You have assigned a new task - " + dataToSave.taskName,
                message: dataToSave.taskDescription,
                type: "single_task",
                userId: user._id,
                id: task._id
            }

            await (new Notification(notification).save())
            if (user.deviceToken) {
                pushNotify(pushData)
            }

        } else {
            for (let child of dataToSave.childArray) {
                let user = await User.findOne({ _id: mongoose.Types.ObjectId(child) })
                let pushData = {
                    data: {
                        title: "Hurry! New Task - " + dataToSave.taskName,
                        body: dataToSave.taskDescription,
                        type: "all_task",
                        taskId: task._id.toString()
                    },
                    token: user.deviceToken
                }

                let notification = {
                    title: "Hurry! New Task - " + dataToSave.taskName,
                    message: dataToSave.taskDescription,
                    type: "all_task",
                    userId: user._id,
                    id: task._id
                }
                await (new Notification(notification).save())
                if (user.deviceToken) {
                    pushNotify(pushData)
                }
            }
        }


    } catch (error) {
        return handleCustomThrow(res, error)
    }
}

//This function is used to list the task of the particular user
export const listTask = async (req, res) => {
    try {
        let tasks = await Task.find({ parentId: req.user._id, isDeleted: false }).sort({ 'createdAt': -1 })
            .populate([
                {
                    path: 'category'
                },
                {
                    path: 'childId'
                }
            ]);
        return sendResponse(res, 200, tasks, "Task list")
    } catch (error) {
        return handleCustomThrow(res, error)
    }
}

// This function is used to list the task of the particular child  in the parent side
export const listTaskChild = async (req, res) => {
    try {
        let tasks = await Task.find({ childId: req.user._id, isDeleted: false }).sort({ 'createdAt': -1 })
            .populate([
                {
                    path: 'category'
                }
            ]);
        return sendResponse(res, 200, tasks, "Task list")
    } catch (error) {
        return handleCustomThrow(res, error)
    }
}

// This function is used to get the detail of the task 
export const detailTask = async (req, res) => {
    try {

        let _id = req.params.id
        let task = await Task.findOne({ _id })
            .populate([
                {
                    path: 'category'
                },
                {
                    path: 'childId'
                }
            ]);
        sendResponse(
            res,
            200,
            task,
            "Task Detail"
        )
    } catch (error) {
        return handleCustomThrow(res, error)
    }
}

// This function is used to accept the task which is created by parent
export const acceptTask = async (req, res) => {
    try {
        const errors = validateAcceptTask(req);
        if (errors) {
            return sendResponse(res, 400, {}, errors[0].msg);
        }

        let task = await Task.findOne({ _id: req.body.taskId })
        let pushData
        let notification
        if (req.body.acceptStatus === '1') {
            if (task.status !== '0') {
                return sendResponse(
                    res,
                    400,
                    {},
                    "This task is already accepted by your sibling before you"
                )
            }
            task.childId = req.user._id
            await task.save();
            sendResponse(
                res,
                200,
                {},
                "Task accepted successfully"
            )

            pushData = {
                data: {
                    title: `Hey! Your task accepted by ${req.user.firstName}`,
                    body: `${task.taskName} is accepted`,
                    type: "accept_task",
                    taskId: task._id.toString()
                },
                token: req.parent.deviceToken
            }

            notification = {
                title: `Hey! Your task accepted by ${req.user.firstName}`,
                message: `${task.taskName} is accepted`,
                type: "accept_task",
                userId: req.parent._id,
                id: task._id
            }
        } else {
            let notInterestedChild = task.notInterestedChildren ? task.notInterestedChildren : []

            notInterestedChild.push({
                cId: req.user._id
            })
            task.notInterestedChildren = notInterestedChild
            await Task.updateOne({ _id: req.body.taskId }, { notInterestedChildren: notInterestedChild })

            sendResponse(
                res,
                200,
                {},
                "Task  not accepted "
            )
            pushData = {
                data: {
                    title: `Hey! Your task rejected by ${req.user.firstName}`,
                    body: `${task.taskName} is rejected`,
                    type: "reject_task",
                    taskId: task._id.toString()
                },
                token: req.parent.deviceToken
            }

            notification = {
                title: `Hey! Your task rejected by ${req.user.firstName}`,
                message: `${task.taskName} is rejected`,
                type: "reject_task",
                userId: req.parent._id,
                id: task._id
            }
        }

        await (new Notification(notification).save())
        if (req.parent.deviceToken) {
            pushNotify(pushData)
        }

    } catch (error) {
        return handleCustomThrow(res, error)
    }
}

// This function is used to mark unread the task which is created by parent
export const unreadTask = async (req, res) => {
    try {

        let taskList = await Task.find({ status: '0', "notInterestedChildren.cId": { $ne: req.user._id } })
        sendResponse(
            res,
            200,
            taskList,
            "Unread task list"
        )
    } catch (error) {
        return handleCustomThrow(res, error)
    }
}

// This function is used to mark read the task which is created by parent
export const makeReadTask = async (req, res) => {
    try {

        await Task.updateOne({ _id: req.params.id }, { readTask: '1' })
        sendResponse(
            res,
            200,
            {},
            "Task read successfully"
        )
    } catch (error) {
        return handleCustomThrow(res, error)
    }
}

// this function is used to update the task
export const updateTask = async (req, res) => {
    try {
        let taskId = req.params.id

        let task = await Task.findOneAndUpdate({ _id: taskId }, req.body)
        sendResponse(
            res,
            200,
            {},
            "Task update successfully"
        )

        if (req.body.status == '0') {
            let user = await User.findOne({ _id: task.childId })
            let pushData = {
                data: {
                    title: `Task is rejected by parent`,
                    body: `Hey! Your Submitted task is rejected by parent`,
                    type: `parent_reject_task`,
                    taskId: taskId.toString()
                },
                token: user.deviceToken
            }

            let notification = {
                title: `Task is rejected by parent`,
                message: `Hey! Your Submitted task is rejected by parent`,
                type: `parent_reject_task`,
                userId: user._id,
                id: taskId
            }
            await (new Notification(notification).save())
            if (user.deviceToken) {
                pushNotify(pushData)
            }
        } else if (req.body.status == '1') {
            let user = req.parent
            let pushData = {
                data: {
                    title: "Task is submitted by child",
                    body: "Hey! Your created task is submitted by child",
                    type: "submit_task",
                    taskId: taskId.toString()
                },
                token: user.deviceToken
            }

            let notification = {
                title: "Task is submitted by child",
                message: "Hey! Your created task is submitted by child",
                type: "submit_task",
                userId: user._id,
                id: taskId
            }

            await (new Notification(notification).save())
            if (user.deviceToken) {
                pushNotify(pushData)
            }
        }

    } catch (error) {
        return handleCustomThrow(res, error)
    }
}

// by using this function parent can send reward to child
export const rewardSend = async (req, res) => {
    try {
        const errors = validateRewardSend(req);
        if (errors) {
            return sendResponse(res, 400, {}, errors[0].msg);
        }

        let task = await Task.findOne({ _id: req.body.taskId })
        let child = await User.findOne({ _id: req.body.childId })
        if (child.cardActiveStatus == '0' || child.temporaryCardStatus == '0') {
            return sendResponse(res, 400, {}, "Please check your account balance or your child's card activation status.")
        }
        if (task.monetaryReward) {
            let parent = req.user
            let amount = task.rewardAmount
            let message = "Task reward"
            let transferDatails = await processTransferFromWalletToCard(parent, child, amount, message)
            //save transaction info to table
            await (new Transaction({
                fromUserId: parent._id,
                toUserId: child._id,
                transactionId: transferDatails.id,
                amount: amount,
                message: message,
                type: '12',
            }).save())

            // add balance to child database
            let previousBalance = child.totalCardBalance ? child.totalCardBalance : 0
            child.totalCardBalance = +previousBalance + +amount
            await child.save();


            // get parant wallet balance 
            let walletBalance = await getWalletCard(parent.matchmoveId);
            // console.log({ walletBalance })
            parent.totalWallet = walletBalance.funds.available.amount;
            await parent.save()
        }


        if (req.body.bonus) {

            if (task.bonusMonetry) {
                let parent = req.user
                let amount = task.bonusAmount
                let message = "Task bonus"
                let transferDatails = await processTransferFromWalletToCard(parent, child, amount, message)
                //save transaction info to table
                await (new Transaction({
                    fromUserId: parent._id,
                    toUserId: child._id,
                    transactionId: transferDatails.id,
                    amount: amount,
                    message: message,
                    type: '12',
                }).save())

                // add balance to child database
                let previousBalance = child.totalCardBalance ? child.totalCardBalance : 0
                child.totalCardBalance = +previousBalance + +amount
                await child.save();


                // get parant wallet balance 
                let walletBalance = await getWalletCard(parent.matchmoveId);
                // console.log({ walletBalance })
                parent.totalWallet = walletBalance.funds.available.amount;
                await parent.save()
            }
            task.specialBonus = true
        }
        // update task data
        task.status = '3';
        await task.save()

        sendResponse(
            res,
            200,
            {},
            "Successfully transfer to child"
        )

        // send notification to child
        let pushData = {
            data: {
                title: "Hey! Your task is updated",
                body: `Your amount has been send to your wallet`,
                type: "reward_task",
                taskId: task._id.toString()
            },
            token: child.deviceToken
        }

        let notification = {
            title: "Hey! Your task is updated",
            message: `Your amount has been send to your wallet`,
            type: "reward_task",
            userId: child._id,
            id: task._id
        }

        await (new Notification(notification).save())
        if (child.deviceToken) {
            pushNotify(pushData)
        }

    } catch (error) {
        return handleCustomThrow(res, error)
    }
}

// by using this function parent can send special reward to child
export const specialRewards = async (req, res) => {
    try {

        let task = await Task.find({
            childId: req.user._id,
            specialBonus: true
        }).populate('category')

        sendResponse(
            res,
            200,
            task,
            "Special rewards "
        )
    } catch (error) {
        return handleCustomThrow(res, error)
    }
}

// by usingh this function cron can send task reminder
export const taskReminder = async (req, res) => {
    let datas = await Task.aggregate([
        {
            $lookup: {
                "from": 'users',
                "localField": 'childId',
                "foreignField": "_id",
                "as": "user"
            }
        },
        {
            $project: {
                "taskName": "$taskName",
                "status": "$status",
                "taskId": "$_id",
                "user": "$user",
                "year": { $year: "$dueDate" },
                "month": { $month: "$dueDate" },
                "day": { $dayOfMonth: "$dueDate" }
            }
        },
        {
            $match: {
                "year": new Date().getFullYear(),
                "month": new Date().getMonth() + 1,
                "day": new Date().getDate() + 1,
                "status": '0'
            },
        },

        {
            $group: {
                "_id": { "taskName": "$taskName", user: "$user", "taskId": '$taskId' },
            }
        }]);

    for (let data of datas) {
        // send notification to child
        let pushData = {
            data: {
                title: "Task Reminder",
                body: `Reminder for task: ${data.taskName}`,
                type: "reminder_task",
                taskId: data.taskId.toString()
            },
            token: data.user[0].deviceToken
        }

        let notification = {
            title: "Task Reminder",
            message: `Your amount has been send to your wallet`,
            type: "reminder_task",
            userId: data.user[0]._id,
            id: data.taskId._id
        }

        await (new Notification(notification).save())
        if (data.user[0].deviceToken) {
            pushNotify(pushData)
        }
    }
    sendResponse(
        res,
        200,
        {},
        "Successfully transfer to child"
    )
}