import {
    validateUserStatusManagePayload
} from './_requestValidators';

import { sendResponse } from '../../utils/sendResponse';
import { User, PricingEngine, Contractor } from "../../models";


export const userList = async (req, res, next) => {
    try {
        let user = await User.find({})
        sendResponse(res, 200, user, "User List");
    } catch (error) {
        next(error)
    }
}

export const userDetails = async (req, res, next) => {
    try {
        let user = await User.findOne({ _id: req.params.id })
        sendResponse(res, 200, user, "User Details");
    } catch (error) {
        next(error)
    }
}

export const contList = async (req, res, next) => {
    try {
        let user = await Contractor.find({})
        sendResponse(res, 200, user, "Contractor List");
    } catch (error) {
        next(error)
    }
}

export const contDetails = async (req, res, next) => {
    try {
        let user = await Contractor.findOne({ _id: req.params.id })
        sendResponse(res, 200, user, "Contractor Details");
    } catch (error) {
        next(error)
    }
}

export const userStatusManage = async (req, res, next) => {
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
        next(error)
    }
}

export const updatePricingEngine = async (req, res, next) => {
    try {
        let body = req.body
        await PricingEngine.updateMany({}, body);
        sendResponse(res, 200, {}, "Pricing Update")
    } catch (error) {
        next(error)
    }
}