import ejs from 'ejs'
import {
    validateLoginPayload,
    validateforgetPasswordPayload,
    validateEamilVerifyPayload,
    validateForgetChangePassword
} from './_requestValidators';
import { sendResponse, handleCustomThrow } from '../../utils/sendResponse';
import { issueJWT } from '../../utils/jwt';
import { makeRandomString } from '../../utils/randomString';
import { sendMail } from '../../utils/email';
import { User, Card } from "../../models";

/* User will be able to login into the platform by providing following details: 
     • Email Id 
     • Password

 Note: Email id should be the same email id by which user will be registered or performed the sign-up on the platform.

 Note: The email id and the password will be verified and after successful verification user will be redirected to the Home | Dashboard Screen. */

export const loginUser = async (req, res) => {
    try {
        const errors = validateLoginPayload(req);
        if (errors) {
            return sendResponse(res, 400, {}, errors[0].msg);
        }

        let bodyData = req.body
        let userCheck = await User.findByCredentials(bodyData.email, bodyData.password)

        delete userCheck.userToken;

        if (userCheck.emailVerifyStatus === '0') {
            return sendResponse(res, 400, userCheck, "Your email id is not verified");
        }

        if (userCheck.phoneOtpStatus === '0') {
            return sendResponse(res, 400, userCheck, "Your phone is not verified");
        }

        if (userCheck.status !== '1') {
            return sendResponse(res, 400, {}, "User is inactive");
        }

        let userUpdate = await User.findOne({ email: req.body.email }, {})
        userUpdate.userToken = await issueJWT({ payload: { id: userCheck._id } });
        userUpdate.deviceToken = req.body.deviceToken;
        userUpdate.deviceType = req.body.deviceType;
        await userUpdate.save();
        let cardCount = await Card.findOne({ "parentId": userUpdate._id }).countDocuments()
        let sendData = JSON.parse(JSON.stringify(userUpdate))
        sendData.cardDetail = cardCount

        return sendResponse(res, 200, sendData, "Login Successfully");

    } catch (error) {
        return handleCustomThrow(res, error);
    }
}
/*
User will be able to enter his registered email id in the text field.

Note: User will be able to enter the email address which will undergo the verification process and after successful verification a password reset link will be shared on the email id of the user from where user will be able to reset his password and able to login by using new credentials.
*/
export const forgetPassword = async (req, res) => {
    try {
        const errors = validateforgetPasswordPayload(req);
        if (errors) {
            return sendResponse(res, 400, {}, errors[0].msg);
        }
        let email = req.body.email.toLowerCase()
        let user = await User.findOne({ email: email });
        if (!user) {
            return sendResponse(res, 400, {}, "User not found")
        }

        sendResponse(
            res,
            200,
            {},
            'Link send to your register email id'
        );
        // make random string 
        let string = makeRandomString(50)
        // decode to base 64
        let url = Buffer.from(string).toString('base64')

        // save data to user email 
        let emailUrl = {
            url: string,
            createdAt: new Date()
        }
        await User.updateOne({ _id: user._id }, { emailUrl })
        let emailPageData = {
            link: `http://zimble.sg/reset-password?v=${url}`,
            firstName: user.familyName
        }
        let html = await ejs.renderFile(__basedir + "/views/auth/forget-password-link.ejs", emailPageData)

        //  send mail to user 
        let mailData = {
            to: email,
            subject: "Reset your Password",
            html
        }
        await sendMail(mailData)

    } catch (error) {
        console.log({ error })
        return handleCustomThrow(res, error);
    }
}

/*
    This function takes a token of forgetting password and validate that token is current or not 
*/
export const forgetPasswordVerify = async (req, res) => {
    try {
        const errors = validateEamilVerifyPayload(req);
        if (errors) {
            return sendResponse(res, 400, {}, errors[0].msg);
        }
        // base64 to string
        let url = Buffer.from(req.query.v, 'base64').toString('ascii')
        // get user details from the user table by string token
        let user = await User.findOne({ "emailUrl.url": url })
        // if user not found 
        if (!user) {
            return sendResponse(res, 400, {}, "Invalid token");
        }

        // check token is expired or not 
        let expireTime = new Date(user.emailUrl.createdAt).getTime() + 600000
        let currentTime = new Date().getTime()
        if (expireTime < currentTime) {
            return sendResponse(res, 400, {}, "Token expired");
        }

        sendResponse(
            res,
            200,
            user,
            'Token verify successfully'
        );
    } catch (error) {
        return handleCustomThrow(res, error);
    }
}

/*
    This function takes a token and password and validate the provided token and then change the user password
*/
export const forgetChangePassword = async (req, res) => {
    try {
        const errors = validateForgetChangePassword(req);
        if (errors) {
            return sendResponse(res, 400, {}, errors[0].msg);
        }

        // base64 to string
        let url = Buffer.from(req.body.v, 'base64').toString('ascii')
        // get user details from the user table by string token
        let user = await User.findOne({ "emailUrl.url": url })
        if (!user) {
            return sendResponse(res, 400, {}, "Invalid token");
        }
        user.password = req.body.password
        user.emailUrl.url = null
        user.save();

        sendResponse(
            res,
            200,
            {},
            'Password changed successfully'
        );

    } catch (error) {
        return handleCustomThrow(res, error);
    }
}
/*
    This function is used to remove the devicetoken ,userToken and deviceType from the database at the time of user logout
*/
export const logout = async (req, res) => {
    try {
        req.user.deviceToken = ''
        req.user.userToken = ''
        req.user.deviceType = ''
        await req.user.save()
        sendResponse(res, 200, {}, "User Logout")
    } catch (error) {
        handleCustomThrow(res, error)
    }
}