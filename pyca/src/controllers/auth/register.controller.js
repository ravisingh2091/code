import { sendResponse, handleCustomThrow } from '../../utils/sendResponse';
import { issueJWT } from '../../utils/jwt';


import { User } from "../../models";
import {
    validateUserCreationPayload
} from './_requestValidators';


export const registerUsers = async (req, res) => {
    try {

        const errors = validateUserCreationPayload(req);
        if (errors) {
            return sendResponse(res, 400, {}, errors[0].msg);
        }
        let email = req.body.email.toLowerCase()
        let phone = req.body.phone

        // find data from the database 
        let userCheck = await User.findOne({ phone })
        if (userCheck) {
            return sendResponse(res, 400, {}, "Phone Number is already in use");
        }

        let location = {
            type: 'Point',
            coordinates: [parseFloat(req.body.long), parseFloat(req.body.lat)]
        }

        // save user data in the database
        let userSave = new User({
            email,
            phone,
            name: req.body.name,
            password: req.body.password,
            address: req.body.address,
            zipCode: req.body.zipCode,
            carModel: req.body.carModel,
            vehicleNumber: req.body.vehicleNumber,
            location: location,
            deviceType: req.body.deviceType,
            deviceToken: req.body.deviceToken,
            userToken: await issueJWT(phone)
        })
        let users = await userSave.save();

        // send response to user
        sendResponse(
            res,
            200,
            users,
            'User registered successfully'
        );

    } catch (error) {
        if (error.name === 'MongoError' && error.code === 11000) {
            return sendResponse(
                res,
                409,
                {},
                'Mobile number already exists'
            );
        }
        return handleCustomThrow(res, error);
    }
}



