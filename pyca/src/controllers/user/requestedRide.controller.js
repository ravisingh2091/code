import { validateRequestedRideSearchPayload, validateRequestRidePayload } from './_requestValidators';
import { sendResponse, handleCustomThrow } from '../../utils/sendResponse';
import { RequestedRide, OfferRide, User, Notification } from "../../models";
import mongoose from '../../db';
import { pushNotify } from '../../utils/notification';

export const requestRide = async (req, res) => {
    try {
        const errors = validateRequestRidePayload(req);
        if (errors) {
            return sendResponse(res, 404, {}, errors[0].msg);
        }

        let body = req.body;
        body.requestedBy = req.user._id;
        body.fromPoint = {
            type: 'Point',
            coordinates: [parseFloat(req.body.fromPointLong), parseFloat(req.body.fromPointLat)]

        }

        body.goingToPoint = {
            type: 'Point',
            coordinates: [parseFloat(req.body.goingToPointLong), parseFloat(req.body.goingToPointLat)]

        }
        let offered = await (new RequestedRide(body)).save()
        sendResponse(
            res,
            200,
            offered,
            "Request added successfully"
        )


        let offeredBy = await User.findOne({ _id: req.body.offeredById })


        let pushData = {
            data: {
                title: "Request for a ride",
                body: `${req.user.name} has requested for a ride.`,
                type: "request_ride",
                id: req.body.offeredId
            },
            token: offeredBy.deviceToken
        }

        let notification = {
            title: "Request for a ride",
            body: `${req.user.name} has requested for a ride.`,
            type: "request_ride",
            userId: offeredBy._id,
            id: req.body.offeredId
        }


        await (new Notification(notification).save())
        if (offeredBy.notification) {
            pushNotify(pushData)
        }

    } catch (error) {
        return handleCustomThrow(res, error)
    }
}

export const requestedRideSearch = async (req, res) => {
    try {
        const errors = validateRequestedRideSearchPayload(req);
        if (errors) {
            return sendResponse(res, 404, {}, errors[0].msg);
        }
        let fromList = await OfferRide.aggregate([
            {
                $geoNear: {
                    near: { type: "Point", coordinates: [parseFloat(req.body.fromPointLong), parseFloat(req.body.fromPointLat)] },
                    key: "fromPoint",
                    spherical: true,
                    maxDistance: 8000,
                    query: {
                        availableSeat: {
                            $gte: parseInt(req.body.requiredSeat)
                        },
                        dateTimeMilliSecond: {
                            $gte: parseInt(req.body.dateTimeMilliSecond) - 30 * 60 * 1000,
                            $lte: parseInt(req.body.dateTimeMilliSecond) + 30 * 60 * 1000,
                        },
                        rideStatus: '0',
                        status: '1',
                        offeredBy: { $ne: mongoose.Types.ObjectId(req.user._id) }
                    },
                    distanceField: "fromDist.calculated",
                    includeLocs: "fromlocs",
                },
            },
            {
                $project: {
                    "_id": 1
                }
            }

        ])

        let finalList = []
        if (fromList.length > 0) {
            let ids = []
            for (let temp of fromList) {
                ids = [...ids, mongoose.Types.ObjectId(temp._id)]
            }

            finalList = await OfferRide.aggregate([

                {
                    $match: {
                        _id: { $in: ids }
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        let: { "userId": "$offeredBy" },
                        pipeline: [
                            {
                                $match:
                                {
                                    $expr:
                                    {
                                        $and:
                                            [
                                                { $eq: ["$_id", '$$userId'] },
                                                { $eq: ["$availability", true] }
                                            ]
                                    }
                                }
                            }
                        ],
                        as: "offeredBy"
                    }
                },
                {
                    "$unwind": "$offeredBy"
                },
                {
                    $project: {
                        "fromPointName": 1,
                        "goingToPointName": 1,
                        "dateAndTime": 1,
                        "availableSeat": 1,
                        "offeredBy.email": 1,
                        "offeredBy.phone": 1,
                        "offeredBy.name": 1,
                        "offeredBy.vehicleNumber": 1,
                        "offeredBy.image": 1,
                        "offeredBy._id": 1
                    }
                }
            ])
        }

        return sendResponse(
            res,
            200,
            { list: finalList, postedData: req.body },
            "Ride List"
        )
    } catch (error) {
        return handleCustomThrow(res, error)
    }
}
