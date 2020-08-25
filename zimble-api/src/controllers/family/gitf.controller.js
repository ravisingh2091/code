import { validateSeachParent, validatePayGift } from './_requestValidators';
import { sendResponse, handleCustomThrow } from '../../utils/sendResponse';
import { Transaction, User, Notification } from "../../models";

import { giftCharge } from '../stripe/stripe.controller';
import { childCardBalance, directAddFundToCard } from '../../utils/matchMove';
import { pushNotify } from '../../utils/notification';

// By using this function we can search the parent by email id 
export const seachParent = async (req, res) => {
    try {
        const errors = validateSeachParent(req);
        if (errors) {
            return sendResponse(res, 400, {}, errors[0].msg);
        }

        let user = await User.findOne({
            $or: [
                { email: req.body.value }
            ],
            userType: "1",
            status: '1'
        }, {
            profilePicture: 1,
            email: 1,
            phone: 1,

        }, { lean: true });


        if (!user) {
            return sendResponse(
                res,
                400,
                {},
                "User not found"
            )
        }
        let child = await User.find({ parentId: user._id, status: '1' }, {
            profilePicture: 1,
            email: 1,
            phone: 1,
            firstName: 1
        })
        user.childData = child



        sendResponse(
            res,
            200,
            user,
            "User found"
        )

    } catch (error) {
        handleCustomThrow(res, error)
    }
}

// This function can add gifted fund in the user account
export const payGift = async (req, res) => {
    try {
        const errors = validatePayGift(req);
        if (errors) {
            return sendResponse(res, 400, {}, errors[0].msg);
        }
        let body = req.body

        let child = await User.findOne({ _id: req.body.child }).populate('parentId')

        // check child card is active or not 
        if (child.cardActiveStatus == '0' || child.temporaryCardStatus == '0') {
            return sendResponse(res, 400, {}, "Your child's card is not activated yet. Please activate it first.");
        }

        await giftCharge(body)

        let description = `Gift from ${body.name}`

        let transferDatails = await directAddFundToCard(child, req.body.amount, description)

        //save transaction info to table
        await (new Transaction({
            fromUserId: child._id,
            toUserId: child._id,
            transactionId: transferDatails.id,
            amount: body.amount,
            message: description,
            type: '1',
        }).save())


        sendResponse(
            res,
            200,
            {},
            "Gift successfully transfer to child"
        )


        // add balance to child database
        let childCardData = await childCardBalance(child.parentId, child)
        child.totalCardBalance = +childCardData.funds.categories.DEFAULT.available.amount

        child.save();

        // send push
        let pushData = {
            data: {
                title: "Gift Money added -",
                body: "Hey! Your money added to your card",
                type: "gift",
            },
            token: child.deviceToken
        }

        let notification = {
            title: "Gift  Money added -",
            message: "Hey! Your money added to your card",
            type: "gift",
            userId: child._id,
        }

        await (new Notification(notification).save())

        if (child.deviceToken) {
            pushNotify(pushData)
        }

    } catch (error) {
        handleCustomThrow(res, error)
    }
}