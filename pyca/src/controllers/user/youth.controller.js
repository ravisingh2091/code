import { validateYouthAddPayload, validateSchedule } from './_requestValidators';
import { sendResponse, handleCustomThrow } from '../../utils/sendResponse';
import { Youth, Schedule } from "../../models";

export const youthAdd = async (req, res) => {
    try {
        const errors = validateYouthAddPayload(req);
        if (errors) {
            return sendResponse(res, 404, {}, errors[0].msg);
        }
        let body = req.body;
        body.userId = req.user._id
        let youthAdd = await (new Youth(body)).save()
        return sendResponse(
            res,
            200,
            youthAdd,
            "Youth added successfully"
        )
    } catch (error) {
        return handleCustomThrow(res, error)
    }
}

export const youthList = async (req, res) => {
    try {
        let youthList
        if (req.query.id) {
            youthList = await Youth.findOne({ _id: req.query.id })
        } else {
            youthList = await Youth.find({ userId: req.user._id })
        }
        return sendResponse(
            res,
            200,
            youthList,
            "Youth List"
        )
    } catch (error) {
        return handleCustomThrow(res, error)
    }
}

export const youthUpdate = async (req, res) => {
    try {
        const errors = validateYouthAddPayload(req);
        if (errors) {
            return sendResponse(res, 404, {}, errors[0].msg);
        }
        sendResponse(
            res,
            200,
            {},
            "Youth updated Successfully"
        )
        await Youth.updateOne({ _id: req.body._id }, req.body)

    } catch (error) {
        return handleCustomThrow(res, error)
    }
}

export const scheduleCreate = async (req, res) => {
    try {
        const errors = validateSchedule(req);
        if (errors) {
            return sendResponse(res, 404, {}, errors[0].msg);
        }

        let body = req.body;
        body.userId = req.user._id;
        body.fromPoint = {
            type: 'Point',
            coordinates: [parseFloat(req.body.fromPointLong), parseFloat(req.body.fromPointLat)]
        }

        body.goingToPoint = {
            type: 'Point',
            coordinates: [parseFloat(req.body.goingToPointLong), parseFloat(req.body.goingToPointLat)]
        }

        let schedule = await new Schedule(body).save()

        sendResponse(
            res,
            200,
            schedule,
            "Schedule Created"
        )
    } catch (error) {
        handleCustomThrow(res, error)
    }
}

export const scheduleUpdate = async (req, res) => {
    try {
        let body = req.body;
        body.userId = req.user._id;

        if (req.body.fromPointLong) {
            body.fromPoint = {
                type: 'Point',
                coordinates: [parseFloat(req.body.fromPointLong), parseFloat(req.body.fromPointLat)]
            }

            body.goingToPoint = {
                type: 'Point',
                coordinates: [parseFloat(req.body.goingToPointLong), parseFloat(req.body.goingToPointLat)]
            }
        }


        await Schedule.updateOne({ _id: req.body._id }, req.body)
        sendResponse(
            res,
            200,
            {},
            "Schedule Updated"
        )
    } catch (error) {
        handleCustomThrow(res, error)
    }
}

export const scheduleList = async (req, res) => {
    try {
        let schedule = await Schedule.find({ userId: req.user._id }).populate('youthId')
        sendResponse(
            res,
            200,
            schedule,
            "Schedule List"
        )
    } catch (error) {
        handleCustomThrow(res, error)
    }
}

export const scheduleDelete = async (req, res) => {
    try {

        let schedule = await Schedule.deleteOne({ _id: req.query.id })

        sendResponse(
            res,
            200,
            schedule,
            "Schedule is removed"
        )
    } catch (error) {
        handleCustomThrow(res, error)
    }
}