import { OfferRide, RequestedRide } from "../../models";
import mongoose from '../../db';

export const offerRideFun = (req, type) => {
    let match
    if (type == "list") {
        let rideType
        if (req.query.rideHistoryType == "schedule") {
            rideType = '0'
        } else if (req.query.rideHistoryType == "ongoing") {
            rideType = '1'
        } else if (req.query.rideHistoryType == "past") {
            rideType = '2'
        }


        match = {
            $match: {
                status: '1',
                offeredBy: mongoose.Types.ObjectId(req.user._id),
                rideStatus: rideType
            }
        }

    } else {
        match = {
            $match: {
                status: '1',
                _id: mongoose.Types.ObjectId(req.query.rideId)
            }
        }
    }
    return OfferRide.aggregate([
        match,
        {
            $lookup: {
                from: "requestedrides",
                let: { "offeredId": "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { "$eq": ["$offeredId", "$$offeredId"] },
                                ]
                            },
                            rideStatus: { $ne: '3' },
                        }
                    },
                    { "$unwind": "$youthId" },
                    {
                        $lookup: {
                            from: "youths",
                            localField: "youthId",
                            foreignField: "_id",
                            as: "youth"
                        }
                    },
                    { "$unwind": "$youth" },
                    {
                        $group: {
                            "_id": "$_id",
                            "youthId": { "$push": "$youth" },
                            "createdAt": { "$first": "$dateAndTime" },
                            "rideStatus": { "$first": "$rideStatus" },
                            "fromPointName": { "$first": "$fromPointName" },
                            "goingToPointName": { "$first": "$goingToPointName" },
                        }
                    }
                ],
                as: "requested"
            }
        },
        {
            $sort: { createdAt: -1 }
        }
    ])
}

export const requestedRideFun = async (req, type) => {
    let match
    if (type == "list") {
        let rideType
        if (req.query.rideHistoryType == "ongoing") {
            rideType = ['2']
        } else if (req.query.rideHistoryType == "schedule") {
            rideType = ['0', '1']
        } else if (req.query.rideHistoryType == "past") {
            rideType = ['4', '3']
        }
        match = {
            $match: {
                rideStatus: { $in: rideType },
                requestedBy: mongoose.Types.ObjectId(req.user._id)
            }
        }
    } else {
        let ride = await RequestedRide.findOne({ _id: req.query.rideId });
        match = {
            $match: {
                offeredId: mongoose.Types.ObjectId(ride.offeredId)
            }
        }
    }


    return RequestedRide.aggregate([
        match,
        { "$unwind": "$youthId" },
        {
            $lookup: {
                from: "youths",
                localField: "youthId",
                foreignField: "_id",
                as: "youth"
            }
        },
        { "$unwind": "$youth" },
        {
            $lookup: {
                from: "users",
                localField: "offeredById",
                foreignField: "_id",
                as: "diriver"
            }
        },
        { "$unwind": "$diriver" },
        {
            $group: {
                "_id": "$_id",
                "youthId": { "$push": "$youth" },
                "diriver": { "$first": "$diriver" },
                "dateAndTime": { "$first": "$dateAndTime" },
                "rideStatus": { "$first": "$rideStatus" },
                "fromPointName": { "$first": "$fromPointName" },
                "offeredId": { "$first": "$offeredId" },
                "offeredById": { "$first": "$offeredById" },
                "goingToPointName": { "$first": "$goingToPointName" },
            }
        },
        {
            $sort: { _id: -1 }
        }
    ])
}