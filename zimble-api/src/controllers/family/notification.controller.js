import { validateNotificationRead } from './_requestValidators'
import { handleCustomThrow, sendResponse } from '../../utils/sendResponse'
import { Notification } from "../../models";

// This function is used to list the user notification
export const notificationList = async (req, res) => {
    try {
        let notification = await Notification.find({ userId: req.user._id }).sort({ 'createdAt': -1 })

        sendResponse(
            res,
            200,
            notification,
            "Notification list "
        )
        await Notification.updateMany({ userId: req.user._id }, { status: '1' })

    } catch (error) {
        return handleCustomThrow(res, error)
    }
}

// This function is used to get the  notification count of the user
export const notificationCount = async (req, res) => {
    try {
        let notification = await Notification.find({ userId: req.user._id, status: '0' }).count()
        sendResponse(
            res,
            200,
            { count: notification },
            "Notification list "
        )
    } catch (error) {

    }
}

// This function is used to mark notification read
export const notificationRead = async (req, res) => {
    try {
        const errors = validateNotificationRead(req);
        if (errors) {
            return sendResponse(res, 400, {}, errors[0].msg);
        }
        await Notification.updateOne({ _id: req.body.notificationId }, { status: '1' })
        sendResponse(
            res,
            200,
            {},
            "Notification list updated "
        )

    } catch (error) {
        return handleCustomThrow(res, error)
    }
}