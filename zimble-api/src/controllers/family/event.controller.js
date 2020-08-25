import { validateAddEventPayload, validateAcceptEvent } from './_requestValidators';
import { sendResponse, handleCustomThrow } from '../../utils/sendResponse';
import { pushNotify } from '../../utils/notification';
import { Event, Notification, User, Chat } from "../../models";
import { addEventChart } from "./../../chat";

/*
This function is used to insert event data into the database 
*/
export const addEvent = async (req, res) => {
    try {
        const errors = validateAddEventPayload(req);
        if (errors) {
            return sendResponse(res, 400, {}, errors[0].msg);
        }
        let dataToSave = req.body
        dataToSave.childId = req.user._id
        let event = await (new Event(dataToSave).save())

        sendResponse(
            res,
            200,
            event,
            "Event Added Successfully"
        );

        new Chat({
            senderId: req.user._id,
            receiverId: req.parent._id,
            roomId: req.user._id,
            message: event.eventName,
            messageType: 'event',
            eventId: event._id,

        }).save();

        addEventChart({
            senderId: req.user._id,
            receiverId: req.parent._id,
            roomId: req.user._id,
            message: event.eventName,
            messageType: 'event',
            eventId: event._id,
            approveStatus: '0'
        })

        let pushData = {
            data: {
                title: "Event request by Child",
                body: 'Want to go on the event',
                type: "event",
                eventId: event._id.toString()
            },
            token: req.parent.deviceToken
        }

        let notification = {
            title: "Event request by Child",
            message: 'Want to go on the event',
            type: "event",
            userId: req.parent._id,
            id: event._id
        }



        await (new Notification(notification).save())
        if (req.parent.deviceToken) {
            pushNotify(pushData)
        }
    } catch (error) {
        return handleCustomThrow(res, error)
    }
}

/*
By using this API user can accept the requested event by child
*/
export const acceptEvent = async (req, res) => {
    try {
        const errors = validateAcceptEvent(req);
        if (errors) {
            return sendResponse(res, 400, {}, errors[0].msg);
        }

        let event = await Event.findOne({ _id: req.body.eventId })


        event.approveStatus = req.body.acceptStatus
        await event.save();

        sendResponse(
            res,
            200,
            {},
            "Event approved Successfully"
        )

        await Chat.updateOne({
            eventId: req.body.eventId
        }, {
            approveStatus: req.body.acceptStatus
        })


        let child = await User.findOne({ _id: event.childId })
        let pushData = {
            data: {
                title: "Event request",
                body: `Your event has been ${req.body.acceptStatus === '1' ? "accepted" : "accepted with conditions"} by parents`,
                type: "accept_event",
                eventId: event._id.toString()
            },
            token: child.deviceToken
        }

        let notification = {
            title: "Event request",
            message: `Your event has been ${req.body.acceptStatus === '1' ? "accepted" : "accepted with conditions"} by parents`,
            type: "accept_event",
            userId: child._id,
            id: event._id
        }

        await (new Notification(notification).save())
        if (child.deviceToken) {
            pushNotify(pushData)
        }

    } catch (error) {
        return handleCustomThrow(res, error)
    }
}
/*
This function is responsible for show the event list to  the parent side
*/
export const listEventParentSide = async (req, res) => {
    try {
        let childs = await User.find({ parentId: req.user._id }).sort({ 'createdAt': -1 })
        let childArray = []

        for (let child of childs) {
            childArray.push(child._id)
        }

        let event = await Event.find({ childId: { $in: childArray } })

        sendResponse(
            res,
            200,
            event,
            "Event list "
        )
    } catch (error) {
        return handleCustomThrow(res, error)
    }
}
/*
This function is responsible for show the event list to  the child side
*/
export const listEventChildSide = async (req, res) => {
    try {

        let event = await Event.find({ childId: req.user._id }).sort({ 'createdAt': -1 })
        sendResponse(
            res,
            200,
            event,
            "Event list "
        )
    } catch (error) {
        return handleCustomThrow(res, error)
    }
}
// This function is responsible for show the event details
export const eventDetails = async (req, res) => {
    try {

        let event = await Event.findOne({ _id: req.params.id })
        sendResponse(
            res,
            200,
            event,
            "Event Details "
        )
    } catch (error) {
        return handleCustomThrow(res, error)
    }
}


