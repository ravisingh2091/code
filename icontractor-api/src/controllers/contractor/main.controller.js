import { sendResponse } from '../../utils/sendResponse';
import { Contractor } from "../../models";

export const contDetail = (req, res, next) => {
    try {
        sendResponse(
            res,
            200,
            req.user,
            "Contractor details."
        )
    } catch (error) {
        next(error)
    }
}

export const contUpdate = async (req, res, next) => {
    try {
        let contId = req.user._id
        let body = req.body

        if (body.lat) {
            body.location = {
                type: 'Point',
                coordinates: [body.long, body.lat]
            }
        }

        await Contractor.updateOne({ _id: contId }, body)

        sendResponse(
            res,
            200,
            {},
            "Contractor update."
        )
    } catch (error) {
        next(error)
    }
}