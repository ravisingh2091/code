import moment from 'moment'
import { validateAddBalanceToChildCard } from './_requestValidators';
import { sendResponse, handleCustomThrow } from '../../utils/sendResponse';
import { processTransferFromWalletToCard, getWalletCard } from "../../utils/matchMove";
import { User, Transaction, Notification } from '../../models';
import { pushNotify } from "./../../utils/notification";

//This function is used the add fund in the child card
export const addBalanceToChildCard = async (req, res) => {
    try {
        const errors = validateAddBalanceToChildCard(req);
        if (errors) {
            return sendResponse(res, 400, {}, errors[0].msg);
        }

        if (req.body.amount <= 0) {
            return sendResponse(res, 400, {}, "Amount must be greater then 0 ");
        }

        let parent = req.user
        let child = await User.findOne({ _id: req.body.childId })
        let amount = req.body.amount
        let message = req.body.message

        if (child.cardActiveStatus == '0' || child.temporaryCardStatus == '0') {
            return sendResponse(res, 400, {}, "Your child's card is not activated yet. Please activate it first.");
        }

        let transferDatails = await processTransferFromWalletToCard(parent, child, amount, message)

        //save transaction info to table
        await (new Transaction({
            fromUserId: parent._id,
            toUserId: child._id,
            transactionId: transferDatails.id,
            amount: amount,
            message: message,
            type: '1',
        }).save())

        // add balance to child database
        let previousBalance = child.totalCardBalance ? child.totalCardBalance : 0
        child.totalCardBalance = +previousBalance + +amount
        await child.save();

        // get parent wallet balance 
        let walletBalance = await getWalletCard(parent.matchmoveId);
        // console.log({ walletBalance })
        parent.totalWallet = walletBalance.funds.available.amount;
        await parent.save()

        sendResponse(
            res,
            200,
            transferDatails,
            "Successfully transfer to child"
        )

        // send push
        let pushData = {
            data: {
                title: "Money added -",
                body: "Hey! Your money added to your card",
                type: "card_recharge",
            },
            token: child.deviceToken
        }

        let notification = {
            title: "Money added -",
            message: "Hey! Your money added to your card",
            type: "card_recharge",
            userId: child._id,
        }

        await (new Notification(notification).save())

        if (child.deviceToken) {
            pushNotify(pushData)
        }


    } catch (error) {
        return handleCustomThrow(res, error)
    }
}

//  This function is used to add balance to child card by crontab
export const autoAddBalanceToChildCard = async (req, res) => {


    let childDetail = await User.find({ allowanceAutoMode: true, allowanceDate: moment().format("YYYY-MM-DD") })
        .populate('parentId')

    for (let child of childDetail) {
        let parent = child.parentId
        let amount = child.allowanceAmountLimit
        let message = "Auto add balance"
        processTransferFromWalletToCard(parent, child, amount, message)
            .then(async transferDatails => {
                // add balance to child database
                let previousBalance = child.totalCardBalance ? child.totalCardBalance : 0
                child.totalCardBalance = +previousBalance + +amount
                child.allowanceDate = moment(child.allowanceDate).add(1, 'M').toISOString()
                await child.save();

                // get parent wallet balance 
                let walletBalance = await getWalletCard(parent.matchmoveId);
                // console.log({ walletBalance })
                parent.totalWallet = walletBalance.funds.available.amount;
                await parent.save()


                //save transaction info to table
                await (new Transaction({
                    fromUserId: parent._id,
                    toUserId: child._id,
                    transactionId: transferDatails.id,
                    amount: amount,
                    message: message,
                    type: '1',
                }).save())

                // send push
                let pushData = {
                    data: {
                        title: "Money added -",
                        body: "Hey! Your money added to your card",
                        type: "card_recharge",
                    },
                    token: child.deviceToken
                }

                let notification = {
                    title: "Money added -",
                    message: "Hey! Your money added to your card",
                    type: "card_recharge",
                    userId: child._id,
                }

                await (new Notification(notification).save())

                if (child.deviceToken) {
                    pushNotify(pushData)
                }
            })
    }



    sendResponse(
        res,
        200,
        {},
        "Successfully transfer to child"
    )



}

//  This function is used to reset funnd of child card by crontab
export const resetChildLimit = async (req, res) => {
    await User.updateMany({ userType: '0' }, { useSpendLimit: 0 })
    sendResponse(res, 200, {}, "Limit reset")
}