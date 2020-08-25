import bcrypt from 'bcrypt';
import {
    validateLoginPayload,
    validateCheckNumberPayload,
    validateForgetPasswordPayload,
    validateChangePasswordPayload
} from './_requestValidators';
import { sendResponse, handleCustomThrow } from '../../utils/sendResponse';
import { issueJWT } from '../../utils/jwt';
import { User } from "../../models";


export const loginUser = async (req, res) => {
    try {
        const errors = validateLoginPayload(req);
        if (errors) {
            return sendResponse(res, 404, {}, errors[0].msg);
        }

        let bodyData = req.body

        let userCheck = await User.findOne({ phone: bodyData.phone });

        if (!userCheck) {
            return sendResponse(res, 400, {}, 'Invalid Phone Number/Password')
        }


        if (!await bcrypt.compare(bodyData.password, userCheck.password)) {
            return sendResponse(res, 400, {}, 'Invalid Phone Number/Password')
        }

        if (userCheck.status !== '1') {
            return sendResponse(res, 400, {}, "Your account has been blocked due to some suspicious");
        }


        userCheck.userToken = await issueJWT(bodyData.phone);
        userCheck.deviceToken = req.body.deviceToken;
        userCheck.deviceType = req.body.deviceType;
        await userCheck.save();

        sendResponse(res, 200, userCheck, "Logged in Successfully");

    } catch (error) {
        return handleCustomThrow(res, error);
    }
}

export const checkNumber = async (req, res) => {
    try {
        const errors = validateCheckNumberPayload(req);
        if (errors) {
            return sendResponse(res, 400, {}, errors[0].msg);
        }
        let phone = req.body.phone
        let user = await User.findOne({ phone });
        if (!user) {
            return sendResponse(res, 400, {}, "User is not registered with us")
        }
        sendResponse(
            res,
            200,
            {},
            'User found'
        );
    } catch (error) {
        return handleCustomThrow(res, error);
    }
}
export const forgetPassword = async (req, res) => {
    try {
        const errors = validateForgetPasswordPayload(req);
        if (errors) {
            return sendResponse(res, 400, {}, errors[0].msg);
        }
        let phone = req.body.phone
        let user = await User.findOne({ phone });
        if (!user) {
            return sendResponse(res, 400, {}, "User is not registered with us")
        }

        user.password = req.body.password
        user.save();
        sendResponse(
            res,
            200,
            {},
            'Password updated successfully'
        );
    } catch (error) {
        return handleCustomThrow(res, error);
    }
}


export const changePassword = async (req, res) => {
    try {
        const errors = validateChangePasswordPayload(req);
        if (errors) {
            return sendResponse(res, 400, {}, errors[0].msg);
        }

        let bodyData = req.body
        if (!await bcrypt.compare(bodyData.old_pass, req.user.password)) {
            return sendResponse(res, 400, {}, 'Invalid Old Password')
        }
        let user = await User.findOne({ _id: req.user._id });
        user.password = req.body.new_pass
        user.save();
        sendResponse(
            res,
            200,
            {},
            'Password updated successfully'
        );

    } catch (error) {
        return handleCustomThrow(res, error);
    }
}