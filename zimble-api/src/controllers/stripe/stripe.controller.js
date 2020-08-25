import stripe from 'stripe';
const stripePay = stripe('sk_test_51F6eRLLr8xu6HSU0SJASRTfDQV0dTPC1cyHMbIyVua7RQJqduJwvcqaP6sPNIzhbKTdzK2SU2zSNBQ4TAL5dtyEY00czQSxZrT')

import {
    validateSaveStripeTokenPayload,
    validateInitialTopupPayload,
    validateSubscribeUser,
    validateUpdateSubscribeUser
} from './_requestValidators';
import { sendResponse, handleCustomThrow } from '../../utils/sendResponse';
import { User, StripeTransaction, Transaction, Card } from "../../models";
import { processAddFundsToWalletDt, getWalletCard } from "../../utils/matchMove";
import { decrypt } from '../../utils/encryptDecrypt';
import { monthlyLoadLimit, dailyLoadLimit } from '../card/cardUtills.controller';
import PLANSDETAILS from '../../utils/plans.json'

// By using this function we can save stripe token 
export const saveStripeToken = async (req, res) => {
    try {
        const errors = validateSaveStripeTokenPayload(req);
        if (errors) {
            return sendResponse(res, 400, {}, errors[0].msg);
        }
        let body = req.body

        let dataToUpdate = {
            stripeToken: body.stripeToken
        }
        let user = await User.findByIdAndUpdate({ _id: req.user._id }, dataToUpdate)
        sendResponse(res, 200, user, "Token update Succssfully")

        if (!await Card.findOne({ "userId": req.user._id, "cardNumber": body.cardNumber }).count()) {
            body.userId = req.user._id
            await (new Card(body).save(body))
        }
    } catch (error) {
        return handleCustomThrow(res, error)
    }
}

// By using this function parent can top up the wallet
export const walletTopup = async (req, res) => {
    try {
        const errors = validateInitialTopupPayload(req);
        if (errors) {
            return sendResponse(res, 400, {}, errors[0].msg);
        }

        await monthlyLoadLimit(req.user._id, req.body.amount)

        await dailyLoadLimit(req.user._id, req.body.amount)
        let cardData = await Card.findOne({ _id: req.body.cardId })
        let expDate = decrypt(cardData.expDate).split("/")
        let token = await stripePay.tokens.create({
            card: {
                number: decrypt(cardData.cardNumber),
                exp_month: expDate[0],
                exp_year: expDate[1],
                cvc: decrypt(cardData.cvv),
            },
        })
        // ((amount + (amount * 3.4 / 100) + 0.5) * 100)
        let amount = Math.round(req.body.amount * 100)
        let paymentIntent = await stripePay.charges.create({
            source: token.id,
            amount: amount,
            currency: 'usd',
            description: req.body.description,
        })

        // console.log({ paymentIntent })

        await (new StripeTransaction({
            userId: req.user._id,
            transactionId: paymentIntent.id,
            amount: req.body.amount,
            description: req.body.description,
        }).save())
        let wallet = await processAddFundsToWalletDt(req.user.email, req.body.amount, req.body.description)
        // console.log({ wallet })
        await (new Transaction({
            fromUserId: req.user._id,
            toUserId: req.user._id,
            transactionId: wallet.id,
            amount: req.body.amount,
            message: req.body.description,
            type: '0'
        }).save())
        let walletBalance = await getWalletCard(req.user.matchmoveId);
        // console.log({ walletBalance })
        await User.updateOne({ _id: req.user._id }, { totalWallet: walletBalance.funds.available.amount })
        return sendResponse(res, 200, {}, "Topup is done")

    } catch (error) {
        return handleCustomThrow(res, error)
    }
}

// By using this function parent can get the stripe transaction history
export const stripeTransactionHistory = async (req, res) => {
    try {
        let stringHistory = await StripeTransaction.find({ "userId": req.user._id })
        return sendResponse(
            res,
            200,
            stringHistory,
            "Stripe Transaction history"
        )
    } catch (error) {
        return handleCustomThrow(res, error)
    }
}

// This function is used to charge the gift
export const giftCharge = (data) => {
    return stripePay.charges.create({
        source: data.tokenId,
        amount: data.amount * 100,
        currency: 'usd'
    })
}

// This function is used to stripe subscription  plan list 
export const subscriptionPlanList = async (req, res) => {
    try {

        let plans = await stripePay.plans.list();

        for (let i = 0; i < plans.data.length; i++) {
            plans.data[i] = {
                ...plans.data[i],
                ...PLANSDETAILS[plans.data[i].id],
                planId: undefined
            }
        }

        sendResponse(
            res,
            200,
            plans,
            "Subscription List"
        )

    } catch (error) {
        handleCustomThrow(res, error)
    }
}

// This funtion is used to add user in the subscription plan list 
export const subscribeUser = async (req, res) => {
    try {
        const errors = validateSubscribeUser(req);
        if (errors) {
            return sendResponse(res, 400, {}, errors[0].msg);
        }

        let planDetails = PLANSDETAILS[req.body.planId]
        if (!planDetails) {
            return sendResponse(res, 400, {}, "No plan data found localy");
        }

        let cardData = await Card.findOne({ _id: req.body.cardId })

        let expiryDate = decrypt(cardData.expDate).split("/")
        let token = await stripePay.tokens.create({
            card: {
                number: decrypt(cardData.cardNumber),
                exp_month: expiryDate[0],
                exp_year: expiryDate[1],
                cvc: decrypt(cardData.cvv),
            },
        });

        let customer = await stripePay.customers.create({
            source: token.id,
            email: req.user.email
        })

        let subscription = await stripePay.subscriptions.create({
            cancel_at_period_end: false,
            customer: customer.id,
            items: [
                {
                    plan: req.body.planId
                }
            ]
        });
        let dataToUpdate = {
            stripe: {
                customerId: customer.id
            },
            subscription: {
                planId: req.body.planId,
                numberOfChild: planDetails.childCount,
                subscriptionId: subscription.id,
                renew: subscription.created * 1000,
                expiry: subscription.current_period_end * 1000,
                status: '1',
            }
        }

        await User.updateOne({ _id: req.user._id }, dataToUpdate)

        sendResponse(
            res,
            200,
            {},
            "User subscribed"
        )
    } catch (error) {
        handleCustomThrow(res, error)
    }
}

// This funtion is used to remove user in the subscription plan list 
export const upgradeSubscribeUser = async (req, res) => {
    try {
        const errors = validateUpdateSubscribeUser(req);
        if (errors) {
            return sendResponse(res, 400, {}, errors[0].msg);
        }

        let planDetails = PLANSDETAILS[req.body.planId]
        if (!planDetails) {
            return sendResponse(res, 400, {}, "No plan data found localy");
        }

        let subscriptionId = req.user.subscription.subscriptionId

        const prevSubscription = await stripePay.subscriptions.retrieve(subscriptionId);

        let subscription = await stripePay.subscriptions.update(subscriptionId, {
            cancel_at_period_end: false,
            proration_behavior: 'create_prorations',
            items: [
                {
                    id: prevSubscription.items.data[0].id,
                    plan: req.body.planId
                }
            ]
        });
        let dataToUpdate = {
            subscription: {
                planId: req.body.planId,
                numberOfChild: planDetails.childCount,
                subscriptionId: subscription.id,
                renew: subscription.created * 1000,
                expiry: subscription.current_period_end * 1000,
                status: '1',
            }
        }

        await User.updateOne({ _id: req.user._id }, dataToUpdate)

        sendResponse(
            res,
            200,
            {},
            "User subscription updated"
        )
    } catch (error) {
        handleCustomThrow(res, error)
    }
}
