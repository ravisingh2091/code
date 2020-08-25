import {
    validateUserListPayload,
    validateUserDetailsPayload,
    validateUserStatusManagePayload
} from './_requestValidators';
import { sendResponse, handleCustomThrow } from '../../utils/sendResponse';
import { User, Youth } from "../../models";


export const userList = async (req, res) => {
    try {
        const errors = validateUserListPayload(req);
        if (errors) {
            return sendResponse(res, 404, {}, errors[0].msg);
        }
        let match;
        let query = req.query
        let limit = 10
        let skip = query.page ? +query.page - 1 : 0
        switch (query.list) {
            case 'all':
                match = { "$match": {} }
                break;
            case 'approved':
                match = { "$match": { adminApproved: '1' } }
                break;
            case 'pending':
                match = { "$match": { adminApproved: '0' } }
                break;
            case 'blocked':
                match = { "$match": { status: '0' } }
                break;
        }
        let user = await User.aggregate([
            {
                "$facet": {
                    "totalData": [
                        match,
                        { "$skip": skip * limit },
                        { "$limit": limit }
                    ],
                    "totalCount": [
                        match,
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
        sendResponse(res, 200, user, "User List");
    } catch (error) {
        return handleCustomThrow(res, error);
    }
}

export const userDetails = async (req, res) => {
    try {
        const errors = validateUserDetailsPayload(req);
        if (errors) {
            return sendResponse(res, 404, {}, errors[0].msg);
        }
        let result = {}
        result.userData = await User.findOne({ _id: req.query.userId }).populate('carModel');
        result.youthData = await Youth.find({ userId: req.query.userId });
        sendResponse(res, 200, result, "User Details");
    } catch (error) {
        return handleCustomThrow(res, error);
    }
}

export const userStatusManage = async (req, res) => {
    try {
        const errors = validateUserStatusManagePayload(req);
        if (errors) {
            return sendResponse(res, 404, {}, errors[0].msg);
        }

        await User.findOneAndUpdate({ _id: req.query.userId }, req.body);
        sendResponse(
            res,
            200,
            {},
            "User updated successfully");
    } catch (error) {
        return handleCustomThrow(res, error);
    }
}
