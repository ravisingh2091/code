import ejs from 'ejs'
import {
    validateAddChildPayload,
    validateOtpVerifyForChildPayload,
    validateChildLimitPayload,
    validateSetupPaymentMethod,
    validateChildAllowanceSet,
    validateChildNewCardActivate,
    validateGenerateIPIN
} from './_requestValidators';
import {
    generateCard,
    addressUpdate,
    fundsDeductFormWallet,
    confirmPayment,
    processAddFundsToWalletDt,
    getWalletCard,
    generateIPIN
} from '../../utils/matchMove';
import { sendResponse, handleCustomThrow } from '../../utils/sendResponse';
import { User, Otp, Card, PersonalizedCard, Transaction, Notification } from "../../models";
import { sendMail } from '../../utils/email';
import { sendSms } from '../../utils/sms';
import { encrypt, decrypt } from '../../utils/encryptDecrypt';
import { pushNotify } from '../../utils/notification';
import PLANSDETAILS from '../../utils/plans.json'



/*
User will be able to enter the payment card details as follows: 
    • Name of the card 
    • Card Number 
    • Expiry date of the card 
    • CVV Number
    • Submit: Card details will be saved on the platform and after that user will be redirected to the Home Screen | Dashboard.

Note: User’s card details will be saved, and the subscription charges will be auto deducted from the card by using the stripe payment gateway. 

*/
export const setupPaymentMethod = async (req, res) => {
    try {
        const errors = validateSetupPaymentMethod(req);
        if (errors) {
            return sendResponse(res, 400, {}, errors[0].msg);
        }
        let dataToSave = {
            parentId: req.user._id,
            cardHolderName: encrypt(req.body.cardHolderName),
            cardNumber: encrypt(req.body.cardNumber),
            expDate: encrypt(req.body.expDate),
            cvv: encrypt(req.body.cvv),
        }
        let card = await (new Card(dataToSave).save())
        return sendResponse(res, 200, card, "User Updateed successfully")
    } catch (error) {
        return handleCustomThrow(res, error)
    }
}

// used to get the user details
export const userDetail = async (req, res) => {
    try {
        let user
        if (req.query.userId) {
            user = await User.findOne({ _id: req.query.userId }, {}, { lean: true })
        } else {
            user = req.user
        }

        if (user.matchMoveWalletCard) {
            user.matchMoveWalletCard = decrypt(user.matchMoveWalletCard)
        }

        if (user.userType === '1') {
            user.planData = PLANSDETAILS[user.subscription.planId]
        }

        return sendResponse(
            res,
            200,
            user,
            "User Details"
        )
    } catch (error) {
        return handleCustomThrow(res, error)
    }
}

// this function is used to update the user details in the database
export const updateUser = async (req, res) => {
    try {
        let dataToUpdate = req.body
        let user = await User.updateOne({ _id: req.user._id }, dataToUpdate, { new: true })
        return sendResponse(res, 200, user, "User Update successfully")
    } catch (error) {
        return handleCustomThrow(res, error)
    }
}

//  this function is used to update the child details in the database
export const updateChild = async (req, res) => {
    try {

        await User.updateOne({ _id: req.body.childId }, req.body)
        // send response 
        sendResponse(
            res,
            200,
            {},
            "User updated successfully"
        )
    } catch (error) {
        return handleCustomThrow(res, error)
    }
}

// By using this function we can verify the child otp and then inster in to the database
export const otpVerifyForChild = async (req, res) => {
    try {
        const errors = validateOtpVerifyForChildPayload(req);
        if (errors) {
            return sendResponse(res, 400, {}, errors[0].msg);
        }
        let email = req.body.email.toLowerCase();
        // get user by email Id
        let user = await Otp.findOne({ email });

        if (!user) {
            return sendResponse(res, 400, {}, "Email Id not found");
        }

        // compair otp form database
        if (user.otp != req.body.otp) {
            return sendResponse(res, 400, {}, "OTP not match");
        }

        // check otp is expired or not 
        let expireTime = new Date(user.updatedAt).getTime() + 600000
        let currentTime = new Date().getTime()

        if (expireTime < currentTime) {
            return sendResponse(res, 400, {}, "Otp time expired");
        }

        await addressUpdate(req.user, req.body)
        let personisalizedCard = await PersonalizedCard.findOne({ _id: req.body.personisalizedCardId })

        let cardData = await generateCard(req.user, req.body, personisalizedCard)

        user.otp = null
        await user.save();

        let dataToSave = req.body
        dataToSave.userType = '0'
        dataToSave.parentId = req.user._id
        dataToSave.status = '1'
        dataToSave.emailVerifyStatus = '1';
        dataToSave.phoneOtpStatus = '1'
        dataToSave.matchmoveId = encrypt(cardData.id)
        dataToSave.matchMoveWalletCard = encrypt(cardData.number)
        dataToSave.matchmoveCardKit = encrypt(cardData.kit)
        dataToSave.matchmoveActivationCode = encrypt(cardData.activation_code)
        dataToSave.cardActiveStatus = '0'
        dataToSave.temporaryCardStatus = '0'
        // save data to database
        let users = await (new User(dataToSave).save())

        sendResponse(
            res,
            200,
            users,
            'Otp verify successfully'
        );

        req.user.address = req.body.address
        await req.user.save()

        if (await User.find({ parentId: req.user._id }).count()) {
            if (req.user.referalBy) {
                let referal = await User.findOne({ _id: req.user.referalBy })
                let wallet = await processAddFundsToWalletDt(referal.email, 5, "Referal balance")
                // console.log({ wallet })
                await (new Transaction({
                    fromUserId: req.user._id,
                    toUserId: req.user._id,
                    transactionId: wallet.id,
                    amount: req.body.amount,
                    message: req.body.description,
                    type: '12'
                }).save())
                let walletBalance = await getWalletCard(req.user.matchmoveId);
                // console.log({ walletBalance })
                referal.totalWallet = walletBalance.funds.available.amount
                referal.save();
            }
        }

        // send welcome mail

        let emailPageData = {
            firstName: req.body.firstName,
            email: req.body.email,
            password: req.body.password,
        }
        let html = await ejs.renderFile(__basedir + "/views/welcome/child-welcome.ejs", emailPageData)

        let mailData = {
            to: req.body.email,
            subject: "Zimble OTP",
            html
        }
        await sendMail(mailData)


    } catch (error) {
        return handleCustomThrow(res, error);
    }
}

// this function is used to activate the child card
export const childNewCardActivate = async (req, res) => {
    try {
        const errors = validateChildNewCardActivate(req);
        if (errors) {
            return sendResponse(res, 400, {}, errors[0].msg);
        }

        await addressUpdate(req.user, req.body)
        let personisalizedCard = await PersonalizedCard.findOne({ _id: req.body.personisalizedCardId })
        let cardData = await generateCard(req.user, req.body, personisalizedCard)
        let child = await User.findOne({ _id: req.body.childId })

        child.address = req.body.address
        child.matchmoveId = encrypt(cardData.id)
        child.matchMoveWalletCard = encrypt(cardData.number)
        child.matchmoveCardKit = encrypt(cardData.kit)
        child.matchmoveActivationCode = encrypt(cardData.activation_code)
        child.cardActiveStatus = '0'
        child.temporaryCardStatus = '0'

        await child.save();

        sendResponse(
            res,
            200,
            child,
            'Otp verify successfully'
        );

    } catch (error) {
        return handleCustomThrow(res, error);
    }
}

// used to remove the child form the parent side by making changes in the child status
export const removeChild = async (req, res) => {
    try {
        let childId = req.params.id
        let parent = req.user
        let child = await User.findOne({ _id: childId })

        let debitData = await fundsDeductFormWallet(parent, 9)
        await confirmPayment(debitData.id)

        child.status = '2'
        child.userToken = ''
        await child.save();

        let walletBalance = await getWalletCard(parent.matchmoveId);
        parent.totalWallet = walletBalance.funds.available.amount
        await parent.save()
        //save transaction info to table


        sendResponse(
            res,
            200,
            {},
            "Fund deduct from parent"
        )


        await (new Transaction({
            fromUserId: parent._id,
            toUserId: parent._id,
            transactionId: debitData.id,
            amount: 9,
            message: 'Child removal charges',
            type: '13',
        }).save())
    } catch (error) {
        handleCustomThrow(res, error)
    }
}
//  This function is used to send the OTP to the child email id at the time of child registration
export const sendOtpForChild = async (req, res) => {
    try {
        const errors = validateAddChildPayload(req);
        if (errors) {
            return sendResponse(res, 400, {}, errors[0].msg);
        }
        let checkUser = await User.findOne({ email: req.body.email })
        if (checkUser) {
            return sendResponse(res, 400, {}, 'Email already registered with us');
        }

        let childCount = await User.find({ parentId: req.user._id, status: { $in: ['0', '1'] } }).count()

        if (childCount + 1 > +req.user.subscription.numberOfChild) {
            return sendResponse(res, 400, {}, "Please check your subscription plan, You can't add more child on current plan");
        }


        if (!await Otp.find({ email: req.body.email }).count()) {
            await (new Otp({
                email: req.body.email
            }).save())
        }

        sendResponse(
            res,
            200,
            {},
            'Otp Send successfully'
        );
        sendOtpToEmail(req.body)
    } catch (error) {
        console.log(error)
        return handleCustomThrow(res, error);
    }

}
// This function is used to resend the OTP to the child email id at the time of child registration
export const resendOtpForChild = async (req, res) => {
    try {
        const errors = validateAddChildPayload(req);
        if (errors) {
            return sendResponse(res, 400, {}, errors[0].msg);
        }
        let email = req.body.email.toLowerCase();
        // get user by phone nubmer 
        let user = await Otp.findOne({ email });
        if (!user) {
            return sendResponse(res, 400, {}, "Email Id not found");
        }
        //send response to user
        sendResponse(
            res,
            200,
            {},
            'Otp send successfully'
        );

        // send otp
        sendOtpToEmail(req.body)
    } catch (error) {
        return handleCustomThrow(res, error);
    }
}

// This function is used to list the child for the parent
export const childList = async (req, res) => {
    try {
        let parentId = req.user._id
        let user = await User.find({ parentId, 'status': { $in: ['0', '1'] } }).sort({ 'createdAt': -1 })
        for (let i = 0; i < user.length; i++) {
            if (user[i].matchMoveWalletCard) {
                user[i].matchMoveWalletCard = decrypt(user[i].matchMoveWalletCard)
            }
        }

        return sendResponse(res, 200, user, "User Update successfully")

    } catch (error) {
        return handleCustomThrow(res, error)
    }
}

// By using this function we set the children to spend limit
export const childSpendLimit = async (req, res) => {
    try {
        const errors = validateChildLimitPayload(req);
        if (errors) {
            return sendResponse(res, 400, {}, errors[0].msg);
        }
        let body = req.body
        sendResponse(res, 200, {}, "Child Limit Set successfully")
        for (let child of body.childData) {
            await User.updateOne({ _id: child._id }, { spendLimit: child.spendLimit })
        }
    } catch (error) {
        return handleCustomThrow(res, error)
    }
}

// By using this function we set the chil allowance

export const childAllowanceSet = async (req, res) => {
    try {
        const errors = validateChildAllowanceSet(req);
        if (errors) {
            return sendResponse(res, 400, {}, errors[0].msg);
        }
        let body = req.body
        sendResponse(res, 200, {}, "Child Limit Set successfully")
        for (let child of body.allowance) {
            await User.updateOne({ _id: child._id }, {
                allowanceAmountLimit: child.allowanceAmountLimit,
                allowanceDate: child.allowanceDate,
                allowanceAutoMode: child.allowanceAutoMode,
            })
        }
    } catch (error) {
        return handleCustomThrow(res, error)
    }
}

// This function is used to send OTP to the parent at the time of IPIN set
export const sendIpinOtp = async (req, res) => {
    try {
        // generate random 4 digit number
        let randomNumber = Math.floor(1000 + Math.random() * 9000)
        // save otp data to database 
        let ipinOtp = {
            otp: randomNumber,
            createdAt: new Date()
        }
        await User.updateOne({ _id: req.parent._id }, { ipinOtp })

        // send sms to user
        await sendSms(`OTP  ${randomNumber}`, req.parent.phone)
        sendResponse(
            res,
            200,
            {},
            "IPIN OTP Send"
        )
    } catch (error) {
        handleCustomThrow(res, error)
    }
}

// This function is used to set the IPIN of the card 
export const generateIpin = async (req, res) => {
    try {
        const errors = validateGenerateIPIN(req);
        if (errors) {
            return sendResponse(res, 400, {}, errors[0].msg);
        }
        let child = req.user
        let parent = req.parent

        // compair otp form database
        if (parent.ipinOtp.otp != req.body.otp) {
            return sendResponse(res, 400, {}, "OTP doesnot match");
        }

        // check otp is expired or not 
        let expireTime = new Date(parent.ipinOtp.createdAt).getTime() + 600000
        let currentTime = new Date().getTime()

        if (expireTime < currentTime) {
            return sendResponse(res, 400, {}, "OTP is expired");
        }


        await generateIPIN(parent, child, req.body.ipin)
        child.ipinSet = true
        await child.save()
        sendResponse(
            res,
            200,
            {},
            "IPIN change successfully"
        )



        // send notification to child
        let pushDataChild = {
            data: {
                title: "IPIN Change",
                body: `Hey! Your card IPIN change`,
                type: "ipin_change"
            },
            token: child.deviceToken
        }

        let notificationChild = {
            title: "IPIN Change",
            message: `Hey! Your card IPIN change`,
            type: "ipin_change",
            userId: child._id
        }

        await (new Notification(notificationChild).save())
        if (child.deviceToken) {
            pushNotify(pushDataChild)
        }

        // send notification to Parent
        let pushDataParent = {
            data: {
                title: "IPIN Change",
                body: `${child.firstName} has change his/her card IPIN`,
                type: "ipin_change"
            },
            token: parent.deviceToken
        }

        let notificationParent = {
            title: "IPIN Change",
            message: `${child.firstName} has change his/her card IPIN`,
            type: "ipin_change",
            userId: parent._id
        }

        await (new Notification(notificationParent).save())
        if (parent.deviceToken) {
            pushNotify(pushDataParent)
        }


    } catch (error) {
        handleCustomThrow(res, error)
    }
}

// this is helper function of OTP send to parent
const sendOtpToEmail = async (user) => {
    // generate random 4 digit number
    let randomNumber = Math.floor(1000 + Math.random() * 9000)
    // save otp data to database 
    let otpData = {
        otp: randomNumber
    }
    await Otp.updateOne({ email: user.email.toLowerCase() }, otpData)
    //  send mail to user 

    let emailPageData = {
        otp: randomNumber,
        firstName: user.firstName
    }
    let html = await ejs.renderFile(__basedir + "/views/auth/childOtp.ejs", emailPageData)

    let mailData = {
        to: user.email,
        subject: "Zimble OTP",
        html
    }
    await sendMail(mailData)
}