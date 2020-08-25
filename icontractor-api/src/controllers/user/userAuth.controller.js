import ejs from 'ejs'
import { validateLogin, validateOtpVerify } from './_requestValidators';
import { sendResponse } from '../../utils/sendResponse';
import { issueJWT } from '../../utils/jwt';
import { sendMail } from '../../utils/email';
import { User } from "../../models";

export const authUser = async (req, res, next) => {
    try {
        const errors = validateLogin(req);
        if (errors) {
            return sendResponse(res, 400, {}, errors[0].msg);
        }
        let body = req.body
        let randomNumber = Math.floor(1000 + Math.random() * 9000)

        body.otpData = {
            otp: randomNumber,
            createdAt: new Date()
        }

        if (req.body.lat && req.body.long) {
            body.location = {
                type: 'Point',
                coordinates: [body.long, body.lat]
            }
        }

        let user = await User.findOneAndUpdate({ email: body.email }, body, { upsert: true, setDefaultsOnInsert: true, new: true })

        sendResponse(
            res,
            200,
            user || {},
            "Otp send to the email. Please verify."
        )

        let emailPageData = { name: body.name, randomNumber }
        let html = await ejs.renderFile(__basedir + "/views/user-otp.ejs", emailPageData)
        //  send mail to user 
        let mailData = {
            to: body.email,
            subject: "I-Contractor OTP",
            html
        }
        await sendMail(mailData)
    } catch (error) {
        next(error)
    }
}

export const verifyOtp = async (req, res, next) => {
    try {
        const errors = validateOtpVerify(req);
        if (errors) {
            return sendResponse(res, 400, {}, errors[0].msg);
        }
        let email = req.body.email;
        // get user by email
        let user = await User.findOne({ email });

        if (!user) {
            return sendResponse(res, 400, {}, "Email not found");
        }

        // compair otp form database
        if (user.otpData.otp != req.body.otp) {
            return sendResponse(res, 400, {}, "OTP doesnot match");
        }

        // check otp is expired or not 
        let expireTime = new Date(user.otpData.createdAt).getTime() + 600000
        let currentTime = new Date().getTime()

        if (expireTime < currentTime) {
            return sendResponse(res, 400, {}, "OTP is expired");
        }

        // issue JWT token for the user and save to database 
        user.userToken = await issueJWT({ payload: { email } });
        user.otpData.otp = null
        user.save();

        sendResponse(
            res,
            200,
            user,
            'OTP verify successfully'
        );

    } catch (error) {
        next(error)
    }
}