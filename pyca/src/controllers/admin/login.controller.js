import bcrypt from 'bcrypt';
import { validateLoginPayload, validateAdminChangePasswordPayload } from './_requestValidators';
import { sendResponse, handleCustomThrow } from '../../utils/sendResponse';
import { issueJWT } from '../../utils/jwt';
import { PASS_HASH_ROUNDS } from '../../config';
import { Admin } from "../../models";


export const loginAdmin = async (req, res) => {
    try {
        const errors = validateLoginPayload(req);
        if (errors) {
            return sendResponse(res, 404, {}, errors[0].msg);
        }

        let bodyData = req.body
        let userCheck = await Admin.findOne({ email: bodyData.email.toLowerCase() });
        if (!userCheck) {
            return sendResponse(res, 400, {}, 'Invalid Credential, user not found')
        }
        if (!await bcrypt.compare(bodyData.password, userCheck.password)) {
            return sendResponse(res, 400, {}, 'Invalid Credential, user not found')
        }
        if (userCheck.status !== '1') {
            return sendResponse(res, 400, {}, "User is inactive");
        }
        userCheck.adminToken = await issueJWT(bodyData.email);
        await userCheck.save();
        sendResponse(res, 200, userCheck, "Admin Login Successfully");
    } catch (error) {
        return handleCustomThrow(res, error);
    }
}

export const adminChangePassword = async (req, res) => {
    try {
        const errors = validateAdminChangePasswordPayload(req);
        if (errors) {
            return sendResponse(res, 404, {}, errors[0].msg);
        }
        let bodyData = req.body
        if (!await bcrypt.compare(bodyData.oldPassword, req.user.password)) {
            return sendResponse(res, 400, {}, 'Wrong old password')
        }
        const salt = bcrypt.genSaltSync(PASS_HASH_ROUNDS);
        const hash = bcrypt.hashSync(bodyData.newPassword, salt);

        sendResponse(
            res,
            200,
            {},
            "Password update successfully");

        await Admin.updateOne({ _id: req.user._id }, { password: hash })


    } catch (error) {
        return handleCustomThrow(res, error);
    }
}