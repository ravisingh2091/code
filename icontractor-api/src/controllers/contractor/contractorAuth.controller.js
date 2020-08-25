import bcrypt from 'bcrypt';
import ejs from 'ejs';

import {
    validateRegister,
    validateLogin,
    validateForgetPassword,
    validateEamilVerify,
    validateForgetChangePassword
} from './_requestValidators';
import { sendResponse } from '../../utils/sendResponse';
import { issueJWT } from '../../utils/jwt';
import { Contractor } from "../../models";
import { makeRandomString } from '../../utils/randomString';
import { sendMail } from '../../utils/email';
import { CONTRACTOR_WEB_URL } from '../../config';

export const registerCont = async (req, res, next) => {
    try {
        const errors = validateRegister(req);
        if (errors) {
            return sendResponse(res, 400, {}, errors[0].msg);
        }
        let body = req.body

        let email = body.email.toLowerCase()
        // find data from the database 
        let userCheck = await Contractor.findOne({ email })

        if (userCheck) {
            return sendResponse(res, 400, {}, "Email is already in use");
        }
        body.userToken = await issueJWT(email)
        // save user data in the database

        let users = await (new Contractor(body)).save();
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
                'Email  already exists'
            );
        }
        next(error);
    }
}

export const loginCont = async (req, res, next) => {
    try {
        const errors = validateLogin(req);
        if (errors) {
            return sendResponse(res, 404, {}, errors[0].msg);
        }

        let bodyData = req.body
        let email = bodyData.email.toLowerCase()
        let userCheck = await Contractor.findOne({ email });

        if (!userCheck) {
            return sendResponse(res, 400, {}, 'Invalid Email/Password')
        }


        if (!await bcrypt.compare(bodyData.password, userCheck.password)) {
            return sendResponse(res, 400, {}, 'Invalid Email/Password')
        }

        if (userCheck.status !== '1') {
            return sendResponse(res, 400, {}, "Your account has been blocked due to some suspicious");
        }

        userCheck.userToken = await issueJWT(email);
        await userCheck.save();

        sendResponse(res, 200, userCheck, "Logged in Successfully");

    } catch (error) {
        next(error)
    }
}

export const forgetPassword = async (req, res, next) => {
    try {
        const errors = validateForgetPassword(req);
        if (errors) {
            return sendResponse(res, 400, {}, errors[0].msg);
        }
        let email = req.body.email.toLowerCase()
        let user = await Contractor.findOne({ email: email });
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
        await Contractor.updateOne({ _id: user._id }, { emailUrl })
        let emailPageData = {
            link: `${CONTRACTOR_WEB_URL}/reset-password?v=${url}`,
            firstName: user.firstName
        }
        let html = await ejs.renderFile(__basedir + "/views/forget-password-link.ejs", emailPageData)

        //  send mail to user 
        let mailData = {
            to: email,
            subject: "Reset your Password",
            html
        }
        await sendMail(mailData)

    } catch (error) {
        next(error);
    }
}

export const forgetPasswordVerify = async (req, res) => {
    try {
        const errors = validateEamilVerify(req);
        if (errors) {
            return sendResponse(res, 400, {}, errors[0].msg);
        }
        // base64 to string
        let url = Buffer.from(req.query.v, 'base64').toString('ascii')
        // get user details from the user table by string token
        let user = await Contractor.findOne({ "emailUrl.url": url })
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
        next(error);
    }
}

export const forgetChangePassword = async (req, res) => {
    try {
        const errors = validateForgetChangePassword(req);
        if (errors) {
            return sendResponse(res, 400, {}, errors[0].msg);
        }

        // base64 to string
        let url = Buffer.from(req.body.v, 'base64').toString('ascii')
        // get user details from the user table by string token
        let user = await Contractor.findOne({ "emailUrl.url": url })
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
