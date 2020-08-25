import {
    validateAllMemeberListPayload,
    validateConnecteMemeberListPayload,
    validateChatListPayload
} from './_requestValidators';
import { sendResponse, handleCustomThrow } from '../../utils/sendResponse';
import { User, Room, Chat, Notification } from "../../models";
import mongoose from '../../db';
import { pushNotify } from '../../utils/notification';


export const getProfileDetails = async (req, res) => {
    try {

        let user = await User.findOne({ '_id': req.user._id }).populate("carModel");
        sendResponse(
            res,
            200,
            user,
            'User details found successfully'
        );
    } catch (error) {
        return handleCustomThrow(res, error)
    }
}

export const updateProfile = async (req, res) => {
    try {
        let dataToUpdate = req.body
        if (req.body.lat && req.body.lat) {
            dataToUpdate.location = {
                type: 'Point',
                coordinates: [parseFloat(req.body.lat), parseFloat(req.body.long)]
            }
        }

        sendResponse(
            res,
            200,
            {},
            'User profile updated successfully'
        );
        await User.updateOne({ _id: req.user._id }, dataToUpdate)
    } catch (error) {
        if (error.name === 'MongoError' && error.code === 11000) {
            return sendResponse(
                res,
                409,
                {},
                'Mobile number already exists'
            );
        }
        return handleCustomThrow(res, error)
    }
}

export const memeberList = async (req, res) => {
    try {
        const errors = validateAllMemeberListPayload(req);
        if (errors) {
            return sendResponse(res, 404, {}, errors[0].msg);
        }
        let memeberList
        if (req.query.memberType == 'all') {
            let notArrya = [mongoose.Types.ObjectId(req.user._id)]

            for (let member of req.user.connectedMember) {
                notArrya.push(mongoose.Types.ObjectId(member.memeberId))
            }


            memeberList = await User.find({
                status: "1",
                adminApproved: "1",
                _id: { $nin: notArrya },
            })

        } else if (req.query.memberType == 'connected') {
            let temp = await User.findOne({ _id: req.user._id }).populate("connectedMember.memeberId")
            memeberList = temp.connectedMember
        }

        sendResponse(
            res,
            200,
            memeberList,
            'Member list'
        );
    } catch (error) {
        return handleCustomThrow(res, error)
    }
}

export const connectMember = async (req, res) => {
    try {

        const errors = validateConnecteMemeberListPayload(req);
        if (errors) {
            return sendResponse(res, 404, {}, errors[0].msg);
        }

        let user = await User.findOne({ "_id": req.user._id })
        let memeber = user.connectedMember ? user.connectedMember : []
        memeber.push({ memeberId: req.query.memberId })
        user.connectedMember = memeber
        user.save();
        sendResponse(
            res,
            200,
            {},
            'Member connected successfully'
        );

        let member = await User.findOne({ _id: req.query.memberId });


        let pushData = {
            data: {
                title: "Connection",
                body: `${req.user.name} is now connected with you`,
                type: "connection"
            },
            token: member.deviceToken
        }

        let notification = {
            title: "Connection",
            body: `${req.user.name} is now connected with you`,
            type: "connection",
            userId: member._id,
        }


        await (new Notification(notification).save())
        if (member.notification) {
            pushNotify(pushData)
        }

    } catch (error) {
        return handleCustomThrow(res, error)
    }
}

export const chatUserList = async (req, res) => {
    try {

        let room = await Room.find({
            "senderId": req.user._id
        }).populate(
            {
                path: 'receiverId',
                select: '_id name email image'
            }
        )

        let finalArray = []
        for (let i = 0; i < room.length; i++) {
            finalArray.push({
                _id: room[i]._id,
                lastMessage: room[i].lastMessage,
                createdAt: room[i].createdAt,
                updatedAt: room[i].updatedAt,
                user: room[i].receiverId
            })
        }


        let roomB = await Room.find({
            "receiverId": req.user._id
        }).populate(
            {
                path: 'senderId',
                select: '_id name email image'
            }
        )

        for (let i = 0; i < roomB.length; i++) {
            finalArray.push({
                _id: roomB[i]._id,
                lastMessage: roomB[i].lastMessage,
                createdAt: roomB[i].createdAt,
                updatedAt: roomB[i].updatedAt,
                user: roomB[i].senderId
            })
        }
        finalArray.sort(function (a, b) {
            return new Date(b.updatedAt) - new Date(a.updatedAt);
        });
        sendResponse(
            res,
            200,
            finalArray,
            'User list'
        );
    } catch (error) {
        return handleCustomThrow(res, error)
    }
}

export const chatList = async (req, res) => {
    try {
        const errors = validateChatListPayload(req);
        if (errors) {
            return sendResponse(res, 404, {}, errors[0].msg);
        }


        let chat = await Chat.find({ roomId: req.query.roomId })
            .populate([
                {
                    path: 'senderId',
                    select: '_id name ,image'
                }, {
                    path: 'receiverId',
                    select: '_id name ,image'
                }
            ]).sort({ createdAt: -1 })

        sendResponse(
            res,
            200,
            chat,
            'User list'
        );
    } catch (error) {
        return handleCustomThrow(res, error)
    }
}

export const notificationList = async (req, res) => {
    try {
        let notification = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 })
        sendResponse(
            res,
            200,
            notification,
            'User list'
        );
    } catch (error) {
        handleCustomThrow(res, error)
    }
}