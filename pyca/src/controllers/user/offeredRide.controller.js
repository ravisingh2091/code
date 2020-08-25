import { validateOfferRidePayload } from './_requestValidators';
import { sendResponse, handleCustomThrow } from '../../utils/sendResponse';
import { OfferRide } from "../../models";

export const offerRide = async (req, res) => {
    try {
        const errors = validateOfferRidePayload(req);
        if (errors) {
            return sendResponse(res, 404, {}, errors[0].msg);
        }

        let body = req.body;
        body.offeredBy = req.user._id;
        body.fromPoint = {
            type: 'Point',
            coordinates: [parseFloat(req.body.fromPointLong), parseFloat(req.body.fromPointLat)]
        }

        body.goingToPoint = {
            type: 'Point',
            coordinates: [parseFloat(req.body.goingToPointLong), parseFloat(req.body.goingToPointLat)]
        }
        let offered = await (new OfferRide(body)).save()
        return sendResponse(
            res,
            200,
            offered,
            "Ride added successfully"
        )
    } catch (error) {
        return handleCustomThrow(res, error)
    }
}
