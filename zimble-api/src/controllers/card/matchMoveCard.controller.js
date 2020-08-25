import { validateActivateCardPayload, validateLockCardPayload, validateLockCard } from './_requestValidators';
import { sendResponse, handleCustomThrow } from '../../utils/sendResponse';

import { User, Notification, Transaction, Saving } from '../../models'
import { pushNotify } from "./../../utils/notification";

import {
    activateCard as aCard,
    reactivateCard as raCard,
    lockCard as lCard,
    createCvv as crCvv,
    getCardTransaction,
    childCardBalance,
    addBalanceToSaveCategory,
    balanceTransferToWallet,
    deleteCardMM
} from '../../utils/matchMove';
import { decrypt } from '../../utils/encryptDecrypt';


/*
    By using this function we activate the user card by using proxy nubmer
*/
export const activateCard = async (req, res) => {
    try {
        const errors = validateActivateCardPayload(req);
        if (errors) {
            return sendResponse(res, 400, {}, errors[0].msg);
        }

        let child = await User.findOne({ "_id": req.body.childId }).populate("personisalizedCardId");

        if (decrypt(child.matchmoveCardKit) != req.body.proxyCode) {
            return sendResponse(res, 400, {}, "Proxy number is not correct.");
        }

        await aCard(req.user, child)

        child.cardActiveStatus = '1'
        child.temporaryCardStatus = '1'
        child.save();

        sendResponse(res, 200, {}, "Card activated successfully")

        let pushData = {
            data: {
                title: "Card Activation",
                body: "Hey! Your card has been activated",
                type: "card_active",
                //badgeId: badgeId
            },
            token: child.deviceToken
        }

        let notification = {
            title: "Card Activation",
            message: "Hey! Your card has been activated",
            type: "card_active",
            userId: child._id,
        }


        await (new Notification(notification).save())
        if (child.deviceToken) {
            pushNotify(pushData)
        }

    } catch (error) {
        return handleCustomThrow(res, error);
    }
}
/*
    By using this function we activate the user card by using proxy nubmer 
*/
export const activateCardByChild = async (req, res) => {
    try {
        const errors = validateActivateCardPayload(req);
        if (errors) {
            return sendResponse(res, 400, {}, errors[0].msg);
        }

        let child = await User.findOne({ "_id": req.body._id }).populate("personisalizedCardId");

        if (child.matchmoveId) {
            return sendResponse(res, 400, {}, "Child has a card.");
        }
        if (!child.personisalizedCardId) {
            return sendResponse(res, 400, {}, "Child card is not found.");
        }

        let cardData = await aCard(req.parent, child, req)
        child.matchmoveId = cardData.id
        child.matchMoveWalletCard = cardData.number
        child.matchmoveCardProxy = req.body.proxyCode
        child.cardActiveStatus = '1'
        child.temporaryCardStatus = '1'
        child.save();

        sendResponse(res, 200, {}, "Card activated successfully")

        let pushData = {
            data: {
                title: "Card Activation",
                body: "Hey! Your card has been activated",
                type: "card_active",
            },
            token: child.deviceToken
        }

        let notification = {
            title: "Card Activation",
            message: "Hey! Your card has been activated",
            type: "card_active",
            userId: child._id,
        }


        await (new Notification(notification).save())
        if (child.deviceToken) {
            pushNotify(pushData)
        }
    } catch (error) {
        return handleCustomThrow(res, error);
    }
}
/*
    By using this function we reactivate the user card by using proxy nubmer 
*/
export const reactivateCard = async (req, res) => {
    try {
        const errors = validateLockCard(req);
        if (errors) {
            return sendResponse(res, 400, {}, errors[0].msg);
        }

        let child = await User.findOne({ "_id": req.body.childId }).populate("personisalizedCardId");
        if (child.temporaryCardStatus == '1') {
            return sendResponse(res, 400, {}, "Card already active mode.");
        }

        await raCard(req.user, child)
        child.temporaryCardStatus = '1'
        child.save();

        sendResponse(res, 200, {}, "Card reaactivated successfully")


        let pushData = {
            data: {
                title: "Card Activation",
                body: "Hey! Your card has been activated",
                type: "card_active",
            },
            token: child.deviceToken
        }

        let notification = {
            title: "Card Activation",
            message: "Hey! Your card has been activated",
            type: "card_active",
            userId: child._id,
        }


        await (new Notification(notification).save())
        if (child.deviceToken) {
            pushNotify(pushData)
        }
    } catch (error) {
        return handleCustomThrow(res, error);
    }
}
/*
    By using this function we lock the user card 
*/
export const lockCard = async (req, res) => {
    try {
        const errors = validateLockCard(req);
        if (errors) {
            return sendResponse(res, 400, {}, errors[0].msg);
        }

        let child = await User.findOne({ "_id": req.body.childId }).populate("personisalizedCardId");
        if (child.cardActiveStatus == '0') {
            return sendResponse(res, 400, {}, "Card already locked");
        }

        await lCard(req.user, child)

        child.temporaryCardStatus = '0'
        child.save();

        sendResponse(res, 200, {}, "Card lock successfully")


        let pushData = {
            data: {
                title: "Lock Card",
                body: "Hey! Your card has been block",
                type: "card_active",
            },
            token: child.deviceToken
        }

        let notification = {
            title: "Lock Card",
            message: "Hey! Your card has been block",
            type: "card_active",
            userId: child._id,
        }

        await (new Notification(notification).save())
        if (child.deviceToken) {
            pushNotify(pushData)
        }

    } catch (error) {
        return handleCustomThrow(res, error);
    }
}

/*
  By using this function we can create CVV of the card for the particular user
*/
export const createCvv = async (req, res) => {
    try {
        const errors = validateLockCardPayload(req);
        if (errors) {
            return sendResponse(res, 400, {}, errors[0].msg);
        }

        let child = await User.findOne({ "_id": req.query.childId }).populate("personisalizedCardId");
        if (!child.matchmoveId) {
            return sendResponse(res, 400, {}, "Child do nat have any card.");
        }

        let cvv = await crCvv(req.parent, child)

        return sendResponse(
            res,
            200,
            cvv,
            "Card reaactivated successfully"
        )
    } catch (error) {
        return handleCustomThrow(res, error);
    }
}

/*
    This function is used to get the user  card transaction history
*/
export const getChildCardTransactionHistory = async (req, res) => {
    try {

        const errors = validateLockCardPayload(req);
        if (errors) {
            return sendResponse(res, 400, {}, errors[0].msg);
        }

        let pageNo = req.query.page ? req.query.page : 1
        let parent = req.user
        let child = await User.findOne({ _id: req.query.childId })
        let transetion = {}
        if (child.matchmoveId) {
            let transectionData = await getCardTransaction(parent, child, pageNo)
            transetion = {
                firstName: child.firstName,
                lastName: child.lastName,
                email: child.email,
                profilePicture: child.profilePicture,
                _id: child._id,
                transectionData: transectionData.transactions
            }
        }

        return sendResponse(
            res,
            200,
            transetion,
            "Transection data "
        )


    } catch (error) {
        return handleCustomThrow(res, error)
    }
}
/*
    This function is used to get the user  transaction history
*/
export const transactionHistoryForChild = async (req, res) => {
    try {
        let pageNo = req.query.page ? req.query.page : 1
        let parentId = req.parent
        let child = req.user

        if (!child.matchmoveId) {
            return sendResponse(
                res,
                400,
                {},
                "Your card is not activated yet."
            )
        }

        let transectionData = await getCardTransaction(parentId, child, pageNo)
        let transetion = {
            firstName: child.firstName,
            lastName: child.lastName,
            email: child.email,
            profilePicture: child.profilePicture,
            _id: child._id,
            transectionData: transectionData.transactions
        }

        return sendResponse(
            res,
            200,
            transetion,
            "Transection data "
        )


    } catch (error) {
        return handleCustomThrow(res, error)
    }
}

/*
    This function is used to get user card to delete/bock request 
*/
export const deleteCardRequest = async (req, res) => {
    try {
        let parent = req.parent
        let child = req.user

        child.cardDeleteRequest = '1'
        child.save();

        sendResponse(
            res,
            200,
            {},
            "Remove request send successfully"
        )

        let pushData = {
            data: {
                title: "Card Remove Request",
                body: `Hey! ${child.firstName} requested to remove his/her card`,
                type: "card_remove_request",
                childId: child._id
            },
            token: parent.deviceToken
        }

        let notification = {
            title: "Card Remove Request",
            message: `Hey! ${child.firstName} requested to remove his/her card`,
            type: "card_remove_request",
            userId: parent._id,
        }

        await (new Notification(notification).save())
        if (parent.deviceToken) {
            pushNotify(pushData)
        }


    } catch (error) {
        handleCustomThrow(res, error)
    }
}

/*
    This function is used to   delete/bock  card 
*/
export const deleteCard = async (req, res) => {
    try {
        let parent = req.user
        let child = await User.findOne({ _id: req.params.id })

        let childBalance = await childCardBalance(parent, child)


        if (childBalance.funds.categories && childBalance.funds.categories.Saving) {
            await addBalanceToSaveCategory(
                parent,
                child,
                {
                    "amount": childBalance.funds.categories.Saving.available.amount,
                    "to": "Default",
                    "from": "Saving"
                }
            )
        }


        let transferDatails = await balanceTransferToWallet(
            parent,
            child,
            {
                amount: parseFloat(childBalance.funds.available.amount),
                message: "Card fund trnasfer to wallet before delete",
            }
        )

        await deleteCardMM(parent, child)

        child.cardDeleteRequest = '0'
        child.cardDeleteRequest = '0'
        child.cardActiveStatus = '0'
        child.matchmoveId = ''
        child.matchMoveWalletCard = ''
        child.matchmoveCardKit = ''
        child.matchmoveActivationCode = ''
        child.totalCardBalance = 0
        child.save()

        sendResponse(
            res,
            200,
            {},
            "Card Delete successfully"
        )

        await Saving.updateMany({ childId: child._id, status: { $in: ['1', '2'] } }, { amountSave: 0 })




        await (new Transaction({
            fromUserId: child._id,
            toUserId: parent._id,
            transactionId: transferDatails.id,
            amount: childBalance.funds.available.amount,
            message: "Card fund trnasfer to wallet before delete",
            type: '9',
        }).save())


        let pushData = {
            data: {
                title: "Card Block",
                body: `Hey! ${child.firstName} your card by parent`,
                type: "card_remove"
            },
            token: child.deviceToken
        }

        let notification = {
            title: "Card Block",
            message: `Hey! ${child.firstName} your card by parent`,
            type: "card_remove",
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
