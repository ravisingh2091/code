import { validateRideDetails } from './_requestValidators';
import { sendResponse, handleCustomThrow } from '../../utils/sendResponse';
import { OfferRide, RequestedRide, User } from "../../models";
import mongoose from "../../db";

export const activeRide = async (req, res) => {
    try {
        let rideStatus
        let query = req.query
        let limit = 10
        let skip = query.page ? +query.page - 1 : 0

        if (query.type == 'active') {
            rideStatus = ['2', '5']
        } else {
            rideStatus = ['4']
        }

        let ride = await RequestedRide.aggregate([
            {
                "$facet": {
                    "totalData": [
                        {
                            $match: {
                                rideStatus: { $in: rideStatus }
                            }
                        },
                        { "$unwind": "$offeredById" },
                        {
                            $lookup: {
                                from: "users",
                                localField: "offeredById",
                                foreignField: "_id",
                                as: "user"
                            }
                        },
                        { "$unwind": "$user" },
                        {
                            $lookup: {
                                from: "carmodels",
                                localField: "user.carModel",
                                foreignField: "_id",
                                as: "user.carmodel"
                            }
                        },
                        { "$unwind": "$user.carmodel" },
                        {
                            $group: {
                                "_id": "$_id",
                                "offeredId": { "$first": "$offeredId" },
                                "name": { "$first": "$user.name" },
                                "vehicleNumber": { "$first": "$user.vehicleNumber" },
                                "carmodel": { "$first": "$user.carmodel.name" },
                                "createdAt": { "$first": "$dateAndTime" },
                                "rideStatus": { "$first": "$rideStatus" },
                                "fromPointName": { "$first": "$fromPointName" },
                                "goingToPointName": { "$first": "$goingToPointName" },
                                "dateAndTime": { "$first": "$dateAndTime" },
                            }
                        },
                        { "$skip": skip * limit },
                        { "$limit": limit }
                    ],
                    "totalCount": [
                        {
                            $match: {
                                rideStatus: { $in: rideStatus }
                            }
                        },
                        {
                            "$group": {
                                "_id": null,
                                "count": { "$sum": 1 }
                            }
                        }
                    ]
                }
            }


        ])

        return sendResponse(
            res,
            200,
            ride,
            "Active ride list"
        )
    } catch (error) {
        return handleCustomThrow(res, error)
    }

}

export const offeredRide = async (req, res) => {
    try {
        let query = req.query
        let limit = 10
        let skip = query.page ? +query.page - 1 : 0

        let offered = await OfferRide.aggregate([
            {
                "$facet": {
                    "totalData": [
                        {
                            $match: {
                                status: '1'
                            }
                        },
                        { "$unwind": "$offeredBy" },
                        {
                            $lookup: {
                                from: "users",
                                localField: "offeredBy",
                                foreignField: "_id",
                                as: "user"
                            }
                        },
                        { "$unwind": "$user" },
                        {
                            $lookup: {
                                from: "carmodels",
                                localField: "user.carModel",
                                foreignField: "_id",
                                as: "user.carmodel"
                            }
                        },
                        { "$unwind": "$user.carmodel" },
                        {
                            $group: {
                                "_id": "$_id",
                                "userId": { "$first": "$user._id" },
                                "name": { "$first": "$user.name" },
                                "vehicleNumber": { "$first": "$user.vehicleNumber" },
                                "carmodel": { "$first": "$user.carmodel.name" },
                                "createdAt": { "$first": "$dateAndTime" },
                                "rideStatus": { "$first": "$rideStatus" },
                                "fromPointName": { "$first": "$fromPointName" },
                                "goingToPointName": { "$first": "$goingToPointName" },
                                "dateAndTime": { "$first": "$dateAndTime" },
                            }
                        },
                        { "$skip": skip * limit },
                        { "$limit": limit }
                    ],
                    "totalCount": [
                        {
                            $match: {
                                status: '1'
                            }
                        },
                        {
                            "$group": {
                                "_id": null,
                                "count": { "$sum": 1 }
                            }
                        }
                    ]
                }
            }
        ])


        return sendResponse(
            res,
            200,
            offered,
            "Offered ride list"
        )

    } catch (error) {
        return handleCustomThrow(res, error)
    }
}

export const scheduleRide = async (req, res) => {
    try {
        let query = req.query
        let limit = 10
        let skip = query.page ? +query.page - 1 : 0


        let offered = await RequestedRide.aggregate([
            {
                "$facet": {
                    "totalData": [
                        {
                            $match: {
                                rideStatus: '1'
                            }
                        },
                        { "$unwind": "$offeredById" },
                        {
                            $lookup: {
                                from: "users",
                                localField: "offeredById",
                                foreignField: "_id",
                                as: "user"
                            }
                        },
                        { "$unwind": "$user" },
                        {
                            $lookup: {
                                from: "carmodels",
                                localField: "user.carModel",
                                foreignField: "_id",
                                as: "user.carmodel"
                            }
                        },
                        { "$unwind": "$user.carmodel" },
                        {
                            $group: {
                                "_id": "$_id",
                                "userId": { "$first": "$user._id" },
                                "name": { "$first": "$user.name" },
                                "vehicleNumber": { "$first": "$user.vehicleNumber" },
                                "carmodel": { "$first": "$user.carmodel.name" },
                                "createdAt": { "$first": "$dateAndTime" },
                                "rideStatus": { "$first": "$rideStatus" },
                                "fromPointName": { "$first": "$fromPointName" },
                                "goingToPointName": { "$first": "$goingToPointName" },
                                "dateAndTime": { "$first": "$dateAndTime" },
                                "offeredId": { "$first": "$offeredId" },
                            }
                        },
                        { "$skip": skip * limit },
                        { "$limit": limit }
                    ],
                    "totalCount": [
                        {
                            $match: {
                                rideStatus: '1'
                            }
                        },
                        {
                            "$group": {
                                "_id": null,
                                "count": { "$sum": 1 }
                            }
                        }
                    ]
                }
            }
        ])


        return sendResponse(
            res,
            200,
            offered,
            "Offered ride list"
        )

    } catch (error) {
        return handleCustomThrow(res, error)
    }
}

export const rideDetails = async (req, res) => {
    try {
        const errors = validateRideDetails(req);
        if (errors) {
            return sendResponse(res, 404, {}, errors[0].msg);
        }



        let rideDetail = await OfferRide.aggregate([
            {
                $match: {
                    status: '1',
                    _id: mongoose.Types.ObjectId(req.query.rideId)
                }
            },
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
                                }
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
                            $lookup: {
                                from: "users",
                                localField: "youth.userId",
                                foreignField: "_id",
                                as: "youth.parent"
                            }
                        },
                        { "$unwind": "$youth.parent" },
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
                $lookup: {
                    from: 'users',
                    localField: "offeredBy",
                    foreignField: "_id",
                    as: "offeredBy"
                }
            },
            {
                $unwind: "$offeredBy"
            },
            {
                $lookup: {
                    from: 'carmodels',
                    localField: "offeredBy.carModel",
                    foreignField: "_id",
                    as: "offeredBy.carModel"
                }
            },
            {
                $unwind: "$offeredBy.carModel"
            },
            {
                $project: {
                    "offeredBy.location": 0,
                    "offeredBy.password": 0,
                    "offeredBy.userToken": 0,
                    "offeredBy.connectedMember": 0,
                    "fromPoint": 0,
                    "goingToPoint": 0,
                }
            }

        ])


        return sendResponse(
            res,
            200,
            rideDetail,
            "Ride Detail "
        )

    } catch (error) {
        return handleCustomThrow(res, error)
    }
}

export const dashboardData = async (req, res) => {
    try {
        let active = await RequestedRide.find({
            rideStatus: { $in: ['2', '5'] }
        }).count()
        let completed = await RequestedRide.find({

            rideStatus: { $in: ['4'] }

        }).count()

        let user = await User.find({}).count()

        return sendResponse(
            res,
            200,
            {
                active,
                completed,
                user
            },
            "Dashboard Data"
        )

    } catch (error) {
        return handleCustomThrow(res, error)
    }
}