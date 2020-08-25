import ejs from 'ejs'
import voucher_codes from 'voucher-code-generator'
import { sendResponse, handleCustomThrow } from '../../utils/sendResponse';
import { sendSms } from '../../utils/sms';
import { sendMail } from '../../utils/email';
import { makeRandomString, makeRandomPassword } from '../../utils/randomString';
import { issueJWT } from '../../utils/jwt';
import { createAccountAndWallet } from '../../utils/matchMove';
import { encrypt } from '../../utils/encryptDecrypt';
import { User } from "../../models";
import {
    validateUserCreationPayload,
    validateOtpVerifyPayload,
    validateEamilVerifyPayload,
    validateResendOtpPayload,
    validateforgetPasswordPayload
} from './_requestValidators';

/*
User will be able to enter following details at the time of creation of account: 
    • Enter Family Name 
    • Select your country Code 
    • Enter your mobile number 
    • Enter your email address
    • Create Password 
    • Enter Referral code 
*/
export const registerUsers = async (req, res) => {
    try {
        const errors = validateUserCreationPayload(req);
        if (errors) {
            return sendResponse(res, 400, {}, errors[0].msg);
        }
        let email = req.body.email.toLowerCase()
        let phone = req.body.phone
        let familyName = req.body.familyName
        let firstName = req.body.firstName
        let lastName = req.body.lastName

        // find data from the database 
        let userCheck = await User.findOne(
            {
                $or: [
                    { email },
                    { phone }
                ]
            }
        )
        if (userCheck) {
            // check email is already in use 
            if (userCheck.email === email) {
                return sendResponse(res, 400, {}, "Email is already in use");
            }

            // check phone is already in use
            if (userCheck.phone === phone) {
                return sendResponse(res, 400, {}, "Phone Number is already in use");
            }
        }
        // matchMove Password
        let matchMovePassword = `$${makeRandomPassword(13)}88`;

        // match Move accout and wallet create
        let MMData = await createAccountAndWallet({
            email,
            phone,
            matchMovePassword,
            familyName,
            firstName,
            lastName
        })

        // save user data in the database
        let userSave = new User({
            email,
            phone,
            familyName,
            firstName,
            lastName,
            matchMovePassword,
            matchmoveId: encrypt(MMData.profileCreate.id),
            matchmoveWalletId: encrypt(MMData.walletCreate.id),
            matchMoveWalletCard: encrypt(MMData.walletCreate.number),
            nationality: req.body.nationality,
            password: req.body.password,
            deviceType: req.body.deviceType,
        })
        let users = await userSave.save();

        // send response to user
        sendResponse(
            res,
            200,
            users,
            'Created users successfully'
        );


        referalCode(users)
        // send otp to user
        sendOtp(users)
        // send url to user email
        sendUrlToEmail(users)

        if (req.body.referalCode) {
            let referalby = await User.findOne({ referalCode: req.body.referalCode })
            if (referalby) {
                users.referalBy = referalby._id
                await users.save();
            }
        }
    } catch (error) {
        if (error.name === 'MongoError' && error.code === 11000) {
            return sendResponse(
                res,
                409,
                {},
                'Duplicate Email, email already exists'
            );
        }
        return handleCustomThrow(res, error);
    }
}

/*
User will be able to enter the OTP verification code that will be received on the provided mobile number. 

Note: If user enters the correct OTP verification code on the screen then his mobile number will be verified successfully. 
*/
export const emailVerify = async (req, res) => {
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
            return sendResponse(res, 400, {}, "Invalid token provide");
        }

        // check token is expired or not 
        let expireTime = new Date(user.emailUrl.createdAt).getTime() + 6000000
        let currentTime = new Date().getTime()
        if (expireTime < currentTime) {
            return sendResponse(res, 400, {}, "OTP is expired");
        }
        user.emailVerifyStatus = '1';
        user.emailUrl.url = null
        user.save();
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
An email verification link will be shared on the email id of the user from where user will be able to verify his email id.

Note: It will be mandatory verification both the phone number as well as the email id to create the account successfully.

After successful verification of email address and the phone number a wallet for the user will be created on the matchmove by using the APIs.

User will be able to use the wallet and able to transfer the amount from the wallet to the child’s account that will be added on the platform.

*/
export const otpVerify = async (req, res) => {
    try {
        const errors = validateOtpVerifyPayload(req);
        if (errors) {
            return sendResponse(res, 400, {}, errors[0].msg);
        }
        let phone = req.body.phone
        // get user by phone nubmer
        let user = await User.findOne({ phone });

        if (!user) {
            return sendResponse(res, 400, {}, "Phone Number not found");
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
        user.userToken = await issueJWT({ payload: { id: user._id } });
        user.deviceToken = req.body.deviceToken;
        user.phoneOtpStatus = '1';
        user.status = '1';
        user.otpData.otp = null
        user.save();

        sendResponse(
            res,
            200,
            user,
            'OTP verify successfully'
        );



        let emailPageData = {
            firstName: user.familyName
        }
        let html = await ejs.renderFile(__basedir + "/views/welcome/parent-welcome.ejs", emailPageData)
        //  send mail to user 
        let mailData = {
            to: user.email,
            subject: "Zimble Email Verification URL",
            html
        }
        await sendMail(mailData)

    } catch (error) {
        return handleCustomThrow(res, error);
    }
}


/*
    This API takes phone no to resend the opt on the user phone
*/
export const resendOtp = async (req, res) => {
    try {
        const errors = validateResendOtpPayload(req);
        if (errors) {
            return sendResponse(res, 400, {}, errors[0].msg);
        }
        let phone = req.body.phone
        // get user by phone nubmer 
        let user = await User.findOne({ phone });
        if (!user) {
            return sendResponse(res, 400, {}, "Phone Number not found");
        }
        //send response to user
        sendResponse(
            res,
            200,
            {},
            'Otp send successfully'
        );

        // send otp
        sendOtp(user)

    } catch (error) {
        return handleCustomThrow(res, error);
    }
}

/*
    This API takes email id to resend the email verification list to the user  phone
*/
export const resendEmailUrl = async (req, res) => {
    try {
        const errors = validateforgetPasswordPayload(req);
        if (errors) {
            return sendResponse(res, 400, {}, errors[0].msg);
        }
        let email = req.body.email;
        // get user by email 
        let user = await User.findOne({ email });
        if (!user) {
            return sendResponse(res, 400, {}, "Email not found");
        }
        //send response to user
        sendResponse(
            res,
            200,
            {},
            'Email send successfully'
        );

        // send otp
        sendUrlToEmail(user)

    } catch (error) {
        return handleCustomThrow(res, error);
    }
}


/*
This code is using to generate the refer code 
*/
const referalCode = async (user) => {
    let code = voucher_codes.generate({
        length: 6,
        count: 1
    });

    await User.updateOne({ _id: user._id }, { referalCode: code[0] })
}

/*
By this function OTP is send
*/
const sendOtp = async (user) => {
    // generate random 4 digit number
    let randomNumber = Math.floor(1000 + Math.random() * 9000)
    // save otp data to database 
    let otpData = {
        otp: randomNumber,
        createdAt: new Date()
    }
    await User.updateOne({ _id: user._id }, { otpData, phoneOtpStatus: '0' })

    // send sms to user
    await sendSms(`OTP  ${randomNumber}`, user.phone)
}
/*
By this function email is send
*/
const sendUrlToEmail = async (user) => {
    // make random string 
    let string = makeRandomString(50)
    // decode to base 64
    let url = Buffer.from(string).toString('base64')
    // save data to user email 
    let emailUrl = {
        url: string,
        createdAt: new Date()
    }
    await User.updateOne({ _id: user._id }, { emailUrl, emailVerifyStatus: '0' })
    let emailPageData = {
        link: `http://zimble.sg/email-verify?v=${url}`,
        firstName: user.familyName
    }
    console.log({ emailPageData })
    let html = await ejs.renderFile(__basedir + "/views/auth/parent-email-verification.ejs", emailPageData)
    //  send mail to user 
    let mailData = {
        to: user.email,
        subject: "Zimble Email Verification URL",
        html
    }
    await sendMail(mailData)
}

