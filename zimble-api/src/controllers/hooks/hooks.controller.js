import { sendResponse, handleCustomThrow } from '../../utils/sendResponse';
import { User, Transaction, Notification } from "../../models";
import { encrypt } from '../../utils/encryptDecrypt';
import { childCardBalance } from '../../utils/matchMove';
import { dailySpendLimit, yearlySpendLimit } from '../card/cardUtills.controller';
import { pushNotify } from '../../utils/notification';

//  this function is used to notify the MM limit of the card and then MM can authorized the transaction
export const spendLimitCheck = async (req, res) => {
    let data = {
        "status": 'INSUFFICIENT_BALANCE',
        'description': 'Card Not Found',
        'settlement_date': `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}`,
        'balance': "0"
    }
    try {
        let matchmoveId = encrypt(req.query.initial_card_id)
        let user = await User.findOne({ matchmoveId }, { useSpendLimit: 1, spendLimit: 1, parentId: 1 }).populate("parentId");
        if (!user) {
            return res.status(200).json(data)
        }

        let childCardData = await childCardBalance(user.parentId, user)
        let balance = +childCardData.funds.categories.DEFAULT.available.amount
        data.balance = balance;

        if (balance < +req.query.card_amount) {
            data.description = "Insufficient balance";

            return res.status(200).json(data)
        }

        let remainingMonthlyLimit = +user.spendLimit - +user.useSpendLimit
        if (+req.query.card_amount > + remainingMonthlyLimit) {
            data.description = "Your monthly limit exide";
            return res.status(200).json(data)
        }
        await dailySpendLimit(user._id, req.query.card_amount)
        await yearlySpendLimit(user._id, req.query.card_amount)

        data.description = "Authorization OK";
        data.status = "OK";;
        res.status(200).json(data)
    } catch (error) {
        if (error.code == 400) {
            data.description = error.msg;
            res.status(200).json(data)
        }
        res.status(200).json(data)
    }
}

// This function is used Handel the post-authorization notification
export const spendingNotification = async (req, res) => {
    let data = {
        "status": 'INSUFFICIENT_BALANCE',
        'description': 'Card Not Found',
    }
    try {
        let mmStatus = req.body.status
        let mmTransactionRefNo = req.body.transaction_ref_no
        let mmCardAmount = req.body.card_amount
        let mmStatusDescription = req.body.status_description
        if ((mmStatus == '00' || mmStatus == 'OK') && mmTransactionRefNo && mmCardAmount && mmStatusDescription) {
            let matchmoveId = encrypt(req.query.initial_card_id)

            let user = await User.findOne({ matchmoveId }).populate("parentId");
            if (!user) {
                return res.status(200).json(data)
            }

            let childCardData = await childCardBalance(user.parentId, user)
            let balance = +childCardData.funds.categories.DEFAULT.available.amount
            user.useSpendLimit += user.useSpendLimit
            user.totalCardBalance = balance
            await user.save()
            data.description = "Successfully";
            data.status = "OK";

            // send response back to MatchMove
            res.status(200).json(data)

            await (new Transaction({
                'transactionId': mmTransactionRefNo,
                'amount': mmCardAmount,
                'fromUserId': user._id,
                'to_user_id': user._id,
                'type': '11',
                'message': mmStatusDescription || "Purchase"
            }).save());


            // send notification to child
            let pushDataChild = {
                data: {
                    title: "Transaction",
                    body: `Hey! ${mmCardAmount} debited from your account`,
                    type: "purchase"
                },
                token: user.deviceToken
            }

            let notificationChild = {
                title: "Transaction",
                message: `Hey! ${mmCardAmount} debited from your account`,
                type: "purchase",
                userId: user._id
            }

            await (new Notification(notificationChild).save())
            if (user.deviceToken) {
                pushNotify(pushDataChild)
            }

            // send notification to Parent
            let pushDataParent = {
                data: {
                    title: `${user.firstName} purchase product`,
                    body: `Hey! ${mmCardAmount} debited from ${user.firstName} account`,
                    type: "purchase",
                },
                token: user.parentId.deviceToken
            }

            let notificationParent = {
                title: `${user.firstName} purchase product`,
                message: `Hey! ${mmCardAmount} debited from ${user.firstName} account`,
                type: "purchase",
                userId: user.parentId._id
            }
            await (new Notification(notificationParent).save())
            if (user.parentId.deviceToken) {
                pushNotify(pushDataParent)
            }
        } else {
            res.status(200).json(data)
        }
    } catch (error) {
        if (error.code == 400) {
            data.description = error.msg;
            res.status(200).json(data)
        }
        res.status(200).json(data)
    }
}

// this function is used to handel the invoice paid hooks by Stripe
export const invoicePaid = async (req, res) => {
    try {
        let invoiceData = req.body
        let userData = await User.findOne({ "stripe.customerId": invoiceData.data.object.customer })
        userData.subscription.renew = invoiceData.data.object.created * 1000
        userData.subscription.expiry = invoiceData.data.object.period_end * 1000
        userData.subscription.status = '1'
        await userData.save()
        sendResponse(res, 200, {}, "Updated")
    } catch (error) {
        handleCustomThrow(res, error)
    }
}

// this function is used to handel the if the subscription delete hooks by Stripe
export const subscriptionDeleted = async (req, res) => {
    try {
        let invoiceData = req.body
        let userData = await User.findOne({ "stripe.customerId": invoiceData.data.object.customer })
        userData.subscription.status = '0'
        await userData.save()
        sendResponse(res, 200, {}, "Updated")
    } catch (error) {
        handleCustomThrow(res, error)
    }
}