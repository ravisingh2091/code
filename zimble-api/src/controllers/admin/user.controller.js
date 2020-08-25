import ejs from 'ejs'

import { validateSeachParent } from './_requestValidators';
import { sendResponse, handleCustomThrow } from '../../utils/sendResponse';
import { User, Transaction, Task, Event, Dispute, Review } from '../../models'
import { decrypt } from '../../utils/encryptDecrypt';
import { sendMail } from '../../utils/email';
import mongoose from '../../db';
import { fundsDeductFormWallet, getWalletCard, confirmPayment } from '../../utils/matchMove';

// used to list the all parent list 
export const listUser = async (req, res) => {
    try {

        let userList = await User.aggregate([
            {
                $match: {
                    userType: '1'
                }
            },
            {
                $lookup: {
                    "from": "users",
                    let: { userId: '$_id' },
                    pipeline: [
                        {
                            $match:
                            {
                                $expr: { $eq: ["$parentId", "$$userId"] },
                                status: { $in: ['0', '1'] }
                            }
                        },
                        {
                            "$group": {
                                "_id": null,
                                "count": { "$sum": 1 }
                            }
                        }
                    ],
                    "as": "child"

                }
            },
            {
                $lookup: {
                    "from": "transactions",
                    let: { userId: '$_id' },
                    pipeline: [
                        {
                            $match:
                            {
                                $expr:
                                    { $eq: ["$fromUserId", "$$userId"] }
                            }
                        },
                        {
                            "$group": {
                                "_id": null,
                                "count": { "$sum": 1 }
                            }
                        }
                    ],
                    "as": "transactions"
                }
            },
            {
                $sort: { 'createdAt': -1 }
            },
            {
                $project: {
                    firstName: 1,
                    lastName: 1,
                    email: 1,
                    phone: 1,
                    familyName: 1,
                    totalWallet: 1,
                    child: 1,
                    transactions: 1,

                }
            },

        ])
        sendResponse(
            res,
            200,
            userList,
            "UserList list"
        )
    } catch (error) {
        return handleCustomThrow(res, error);
    }
}

// used to list the all child
export const childlist = async (req, res) => {
    try {
        let parentId = req.query.parentId
        let match = {}
        if (parentId) {
            match = {
                $match: {
                    parentId: mongoose.Types.ObjectId(parentId),
                    userType: '0',
                    status: { $in: ['0', '1'] }
                }
            }
        } else {
            match = {
                $match: {
                    userType: '0',
                    status: { $in: ['0', '1'] }
                }
            }
        }


        let userList = await User.aggregate([
            match,
            {
                $lookup: {
                    "from": "tasks",
                    let: { userId: '$_id' },
                    pipeline: [
                        {
                            $match:
                            {
                                $expr: {
                                    $eq: ["$childId", "$$userId"]
                                },
                                status: {
                                    "$in": ["3", "4"]
                                }
                            }
                        },
                        {
                            "$group": {
                                "_id": null,
                                "count": { "$sum": 1 }
                            }
                        }
                    ],
                    "as": "task"

                }
            },
            {
                $sort: { 'createdAt': -1 }
            },
            {
                $project: {
                    firstName: 1,
                    lastName: 1,
                    email: 1,
                    phone: 1,
                    age: 1,
                    totalCardBalance: 1,
                    spendLimit: 1,
                    task: 1,

                }
            },

        ])




        sendResponse(
            res,
            200,
            userList,
            "UserList list"
        )

    } catch (error) {
        handleCustomThrow(res, error)
    }
}

// used to get parent detail
export const userDetail = async (req, res) => {
    try {
        let parentId = req.params.id

        let userData = await User.findOne({ _id: parentId }, {
            firstName: 1,
            lastName: 1,
            email: 1,
            phone: 1,
            familyName: 1,
            totalWallet: 1,
            profilePicture: 1,
            coverPicture: 1,
            matchmoveId: 1,
            subscription: 1,
        }, { lean: true })
        userData.childCount = await User.find({ parentId }).countDocuments()
        userData.activeCard = await User.find({ parentId, cardActiveStatus: '1', temporaryCardStatus: '0' }).countDocuments()
        userData.txtCount = await Transaction.find({ fromUserId: parentId }).countDocuments()
        userData.tastCount = await Task.find({ parentId }).countDocuments()

        userData.matchmoveId = decrypt(userData.matchmoveId)

        sendResponse(
            res,
            200,
            userData,
            "UserList list"
        )
    } catch (error) {
        return handleCustomThrow(res, error);
    }
}

// used to get child detail
export const childDetail = async (req, res) => {
    try {
        let childId = req.params.id
        let userData = await User.findOne({ _id: childId }, {}, { lean: true }).populate('personisalizedCardId')

        userData.txtCount = await Transaction.find({ toUserId: childId }).countDocuments()
        userData.tastCount = await Task.find({ childId }).countDocuments()
        userData.eventCount = await Event.find({ childId }).countDocuments()

        userData.matchmoveId = decrypt(userData.matchmoveId)
        userData.matchMoveWalletCard = decrypt(userData.matchMoveWalletCard)
        userData.matchmoveCardKit = userData.matchmoveCardKit ? decrypt(userData.matchmoveCardKit) : ''
        userData.matchmoveActivationCode = userData.matchmoveActivationCode ? decrypt(userData.matchmoveActivationCode) : ''

        sendResponse(
            res,
            200,
            userData,
            "UserList list"
        )
    } catch (error) {
        return handleCustomThrow(res, error);
    }
}

//  used to get all subscriber list 
export const userSubscriptionList = async (req, res) => {
    try {
        let userSub = await User.find({ status: { $ne: '2' }, userType: '1' }, { email: 1, subscription: 1, familyName: 1 })
        sendResponse(
            res,
            200,
            userSub,
            "User subscription List"
        )
    } catch (error) {
        handleCustomThrow(res, error)
    }
}

//  used to get parent data by passing parent emaill id
export const seachParent = async (req, res) => {
    try {
        const errors = validateSeachParent(req);
        if (errors) {
            return sendResponse(res, 400, {}, errors[0].msg);
        }

        let user = await User.findOne({
            email: req.body.email,
            userType: "1",
            status: '1'
        }, {
            phone: 1,
            familyName: 1
        }, { lean: true });

        if (!user) {
            return sendResponse(
                res,
                400,
                {},
                "User not found"
            )
        }
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

// debit the dispute fee 
export const disputeFee = async (req, res) => {
    try {
        let disputeId = 'DIS-' + new Date().getTime()
        //get parent info
        let parent = await User.findOne({ _id: req.params.id })

        let debitData = await fundsDeductFormWallet(parent, 14)
        await confirmPayment(debitData.id)

        let walletBalance = await getWalletCard(parent.matchmoveId);
        parent.totalWallet = +walletBalance.funds.available.amount
        await parent.save()

        await (new Dispute({
            parentId: parent._id,
            adminId: req.user._id,
            amount: 14,
            disputeId: disputeId,
            disputeTxtId: debitData.id
        }).save())

        sendResponse(
            res,
            200,
            {},
            "Dispute processing fee successfully debited"
        )

        await (new Transaction({
            fromUserId: parent._id,
            toUserId: parent._id,
            transactionId: debitData.id,
            amount: 14,
            message: 'Dispute processing fee',
            type: '14',
        }).save())

        let emailPageData = { disputeId }
        let html = await ejs.renderFile(__basedir + "/views/dispute/dispute-raised.ejs", emailPageData)
        //  send mail to user 
        let mailData = {
            to: parent.email,
            subject: "A Dispute is raised on Zimble",
            html
        }
        await sendMail(mailData)


    } catch (error) {
        handleCustomThrow(res, error)
    }
}

//  used to get all parent list of the dispute 
export const disputeFeeList = async (req, res) => {
    try {
        let dispute = await Dispute.find({}).populate({
            path: 'parentId',
            select: ' phone familyName email'
        }).sort({ createdAt: -1 })

        sendResponse(
            res,
            200,
            dispute,
            "Dispute List"
        )
    } catch (error) {
        handleCustomThrow(res, error)
    }
}

//  used to change the dispute status
export const disputeStatus = async (req, res) => {
    try {
        let dispute = await Dispute.findOne({ _id: req.params.id }).populate({
            path: 'parentId',
            select: 'email'
        })
        dispute.status = !dispute.status
        dispute.save();
        sendResponse(
            res,
            200,
            {},
            "Dispute Updated"
        )



        let emailPageData = { disputeId: dispute.disputeId }
        let html = await ejs.renderFile(__basedir + "/views/dispute/dispute-completion.ejs", emailPageData)
        //  send mail to user 
        let mailData = {
            to: dispute.parentId.email,
            subject: "Your reported Dispute is resolved",
            html
        }
        await sendMail(mailData)

    } catch (error) {
        handleCustomThrow(res, error)
    }
}

//  used to get referral details
export const referralDetails = async (req, res) => {
    try {
        let referalData = await User.find({ "referalBy": { $exists: true, $ne: null } }, { "familyName": 1, "email": 1, "phone": 1, "createdAt": 1, "referalBy": 1 })
            .populate({
                path: 'referalBy',
                select: 'familyName email referalCode'
            })

        sendResponse(res, 200, referalData, "Referral List")
    } catch (error) {
        handleCustomThrow(res, error)
    }
}

// get all the review list 
export const listReview = async (req, res) => {
    try {
        let review = await Review.find({}).sort({ 'createdAt': -1 })
        sendResponse(
            res,
            200,
            review,
            "Review list"
        )
    } catch (error) {
        return handleCustomThrow(res, error);
    }
}

// update the review
export const updateReview = async (req, res) => {
    try {
        await Review.updateOne({ _id: req.params.id }, req.body)
        sendResponse(
            res,
            200,
            {},
            "Review updated"
        )
    } catch (error) {
        return handleCustomThrow(res, error);
    }
}

