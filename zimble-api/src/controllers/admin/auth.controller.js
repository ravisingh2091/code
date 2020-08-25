import { validateLoginPayload } from './_requestValidators';
import { sendResponse, handleCustomThrow } from '../../utils/sendResponse';
import { issueJWT } from '../../utils/jwt';
import bcrypt from 'bcrypt';

import { Admin, Transaction, User } from "../../models";

// this function is used to login the admin 
export const loginAdmin = async (req, res) => {
    try {
        const errors = validateLoginPayload(req);
        if (errors) {
            return sendResponse(res, 400, {}, errors[0].msg);
        }

        let bodyData = req.body

        let userCheck = await Admin.findOne({ email: bodyData.email.toLowerCase() })

        if (!userCheck) {
            return sendResponse(res, 400, {}, "Your eamil or password might be wrong");
        }

        let password = await bcrypt.compare(bodyData.password, userCheck.password);

        if (!password) {
            return sendResponse(res, 400, {}, "Your eamil or password might be wrong");
        }

        if (userCheck.status === '0') {
            return sendResponse(res, 400, {}, "Your eamil or password might be wrong");
        }

        userCheck.adminToken = await issueJWT({ payload: { id: userCheck._id } });
        await userCheck.save();
        return sendResponse(res, 200, userCheck, "Login Successfully");

    } catch (error) {
        return handleCustomThrow(res, error);
    }
}

// this function is used to get all the admin dashboard data
export const dashboard = async (req, res) => {
    try {
        let parentCount = await User.find({ userType: '1', status: { $in: ['0', '1'] } }).countDocuments()
        let childCount = await User.find({ userType: '0', status: { $in: ['0', '1'] } }).countDocuments()
        let txtAmount = (await Transaction.aggregate([
            {
                $group: {
                    _id: null,
                    "TotalAmount": {
                        $sum: { $toInt: "$amount" }
                    }
                }
            }
        ]))[0]

        return sendResponse(
            res,
            200,
            {
                parentCount,
                childCount,
                txtAmount
            },
            "Dashboard Data"
        );
    } catch (error) {
        handleCustomThrow(res, error);
    }
}