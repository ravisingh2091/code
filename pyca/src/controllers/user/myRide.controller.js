import {
    validateMyRidePayload,
    validateRideDetailsPayload,
    validateRideStatusPayload,
    validateRideStatusByOfferedId
} from './_requestValidators';
import { sendResponse, handleCustomThrow } from '../../utils/sendResponse';
import { RequestedRide, Notification, User, OfferRide } from "../../models";
import { offerRideFun, requestedRideFun } from './internalFunction'
import { pushNotify } from '../../utils/notification';

export const myRide = async (req, res) => {
    try {
        const errors = validateMyRidePayload(req);
        if (errors) {
            return sendResponse(res, 404, {}, errors[0].msg);
        }

        if (req.query.rideType == 'offer') {

            let offerRide = await offerRideFun(req, "list")

            return sendResponse(
                res,
                200,
                offerRide,
                "My Ride Data"
            )
        } else {
            let requestedRide = await requestedRideFun(req, "list")
            return sendResponse(
                res,
                200,
                requestedRide,
                "My Ride Data"
            )
        }

    } catch (error) {
        return handleCustomThrow(res, error)
    }
}

export const rideDetails = async (req, res) => {
    try {
        const errors = validateRideDetailsPayload(req);
        if (errors) {
            return sendResponse(res, 404, {}, errors[0].msg);
        }
        let ride
        if (req.query.rideType == 'offered') {
            ride = await offerRideFun(req, "details")
        } else if (req.query.rideType == 'requested') {
            ride = await requestedRideFun(req, "details")
        }
        return sendResponse(
            res,
            200,
            ride,
            "Ride Details"
        )

    } catch (error) {
        return handleCustomThrow(res, error)
    }
}

export const rideStatus = async (req, res) => {
    try {
        const errors = validateRideStatusPayload(req);
        if (errors) {
            return sendResponse(res, 404, {}, errors[0].msg);
        }
        let ride = await RequestedRide.findOneAndUpdate({ _id: req.body.requestedId }, { rideStatus: req.body.rideStatus }, { new: true })

        let offerData = await OfferRide.findOne({ _id: ride.offeredId })
        sendResponse(
            res,
            200,
            ride,
            "Ride updated Details"
        )

        let body = ''
        if (req.body.rideStatus == '1') {
            // accepted
            body = 'Driver has accepted your ride. Make your kid ready on time.'
        }
        else if (req.body.rideStatus == '2') {
            //pickup 
            body = 'Driver has picked up your child.'
        } else if (req.body.rideStatus == '3') {
            // cancel
            body = 'Driver has declined your ride.'


            let requestCount = await RequestedRide.find(
                {
                    offeredId: ride.offeredId,
                    rideStatus: '3'
                }).countDocuments();
            let requestTotalCount = await RequestedRide.find(
                {
                    offeredId: ride.offeredId
                }).countDocuments();

            if (requestTotalCount == requestCount) {
                offerData.rideStatus = '2'
            }
        } else if (req.body.rideStatus == '4') {
            // complete
            body = 'Driver has completed the ride and have dropped your child safely.'


            let requestCount = await RequestedRide.find(
                {
                    offeredId: ride.offeredId,
                    rideStatus: { $ne: '3' }
                }).countDocuments();
            let requestCompCount = await RequestedRide.find(
                {
                    offeredId: ride.offeredId,
                    rideStatus: '4'
                }).countDocuments();

            if (requestCompCount >= requestCount) {
                offerData.rideStatus = '2'
            }
        }

        await offerData.save();


        let requestedBy = await User.findOne({ _id: ride.requestedBy })

        let pushData = {
            data: {
                title: "Request for a ride",
                body: body,
                type: "requested_ride_status",
                id: req.body.requestedId
            },
            token: requestedBy.deviceToken
        }

        let notification = {
            title: "Request for a ride",
            body: body,
            type: "requested_ride_status",
            userId: requestedBy._id,
            id: req.body.requestedId
        }


        await (new Notification(notification).save())
        if (requestedBy.notification) {
            pushNotify(pushData)
        }


    } catch (error) {
        return handleCustomThrow(res, error)
    }
}

export const rideStatusByOfferedId = async (req, res) => {
    try {
        const errors = validateRideStatusByOfferedId(req);
        if (errors) {
            return sendResponse(res, 404, {}, errors[0].msg);
        }
        await OfferRide.updateOne({ _id: req.body.OfferedId }, { rideStatus: '1' })

        sendResponse(
            res,
            200,
            {},
            "Ride updated Details"
        )

        let requestDetails = await RequestedRide.find({ _id: req.body.offeredId }).populate('requestedBy')

        for (let requested of requestDetails) {

            let pushData = {
                data: {
                    title: "Request for a ride",
                    body: body,
                    type: "requested_ride_start",
                    id: requested._id
                },
                token: requested.requestedBy.deviceToken
            }

            let notification = {
                title: "Request for a ride",
                body: body,
                type: "requested_ride_start",
                userId: requested.requestedBy._id,
                id: requested._id
            }


            await (new Notification(notification).save())
            if (requested.requestedBy.notification) {
                pushNotify(pushData)
            }
        }


    } catch (error) {
        return handleCustomThrow(res, error)
    }
}