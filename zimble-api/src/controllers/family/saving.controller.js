import { sendResponse, handleCustomThrow } from '../../utils/sendResponse';
import { Saving, User } from "../../models";
import { addBalanceToSaveCategory, childCardBalance } from '../../utils/matchMove';

import {
    validateAddSaving,
    validateTransferToSavingCategory,
    validateTransferToDefaultCategory
} from './_requestValidators';



/*
    • Saving Targets & the goals: User will be able to view the savings targets & goals of the kid with the following details: 
    • Name of the child 
    • Profile picture of the child 
    • Target 
    • Completion of target in percentage 
    • Ability to like the saving target & goals
*/
export const addSaving = async (req, res) => {
    try {
        const errors = validateAddSaving(req);
        if (errors) {
            return sendResponse(res, 400, {}, errors[0].msg);
        }
        let dataToSave = req.body
        dataToSave.childId = req.user._id;
        let saving = await (new Saving(dataToSave).save())

        sendResponse(
            res,
            200,
            saving,
            "Saving Added Successfully"
        )

    } catch (error) {
        return handleCustomThrow(res, error)
    }
}

// This function is used to list the all saving plan to user
export const listSaving = async (req, res) => {
    try {
        let limit = 10;
        let page = req.query.page ? req.query.page : 0
        let savingList = await Saving.find({ childId: req.user._id, status: { $in: ['1', '2'] } })
            .sort({ 'createdAt': -1 }).limit(limit).skip(page * limit)
        return sendResponse(
            res,
            200,
            savingList,
            "Saving list"
        )
    } catch (error) {
        return handleCustomThrow(res, error)
    }
}

//  This function is used to list the all saving plan of child to the parent
export const listSavingForParent = async (req, res) => {
    try {
        let limit = 10;
        let page = req.query.page ? req.query.page : 0

        let childs = await User.find({ "parentId": req.user._id })
        let childList = []
        for (let child of childs) {
            childList.push(child._id)
        }

        let savingList = await Saving.find({ childId: { $in: childList }, status: { $in: ['1', '2'] } })
            .populate({ path: 'childId', select: "profilePicture" })
            .sort({ 'createdAt': -1 })
            .limit(limit).skip(page * limit)
        return sendResponse(
            res,
            200,
            savingList,
            "Saving list"
        )
    } catch (error) {
        return handleCustomThrow(res, error)
    }
}

// show the details of saving plan
export const detailSaving = async (req, res) => {
    try {
        let saving = await Saving.findOne({ _id: req.params.id })
        sendResponse(
            res,
            200,
            saving,
            "Saving details"
        )
    } catch (error) {
        return handleCustomThrow(res, error)
    }
}

//  this function is used mark favorite of saving plan
export const markFavorite = async (req, res) => {
    try {

        let saving = await Saving.findOne({ _id: req.params.id })
        saving.favorite = !saving.favorite
        saving.save()
        sendResponse(
            res,
            200,
            {},
            "Mark as favorite"
        )
    } catch (error) {
        return handleCustomThrow(res, error)
    }
}

// this function is used to transer fund from default category to saving category of MM
export const transferToSavingCategory = async (req, res) => {
    try {
        const errors = validateTransferToSavingCategory(req);
        if (errors) {
            return sendResponse(res, 400, {}, errors[0].msg);
        }

        let childCardData = await childCardBalance(req.parent, req.user)

        let balance = +childCardData.funds.categories.DEFAULT.available.amount
        if (balance < +req.body.amountSave) {
            return sendResponse(res, 400, {}, "Insufficient balance");
        }

        let data = {
            "amount": req.body.amountSave,
            "from": "Default",
            "to": "Saving"
        }
        await addBalanceToSaveCategory(req.parent, req.user, data)

        let saving = await Saving.findOne({ _id: req.body.savingId })
        saving.amountSave = saving.amountSave + +req.body.amountSave
        saving.save();
        sendResponse(
            res,
            200,
            {},
            "Added to saving amount"
        )
        let user = req.user
        user.totalCardBalance = +user.totalCardBalance - +req.body.amountSave
        user.save();
    } catch (error) {
        return handleCustomThrow(res, error)
    }
}

// this function is used to transer fund from saving category to default category of MM
export const transferToDefaultCategory = async (req, res) => {
    try {
        const errors = validateTransferToDefaultCategory(req);
        if (errors) {
            return sendResponse(res, 400, {}, errors[0].msg);
        }
        let data = {
            "amount": req.body.amountDefault,
            "to": "Default",
            "from": "Saving"
        }
        await addBalanceToSaveCategory(req.parent, req.user, data)
        let saving = await Saving.findOne({ _id: req.body.savingId })
        saving.status = '2'
        saving.save();
        sendResponse(
            res,
            200,
            {},
            "Added to default category"
        )
        let user = req.user
        user.totalCardBalance = +user.totalCardBalance + +req.body.amountDefault
        user.save();
    } catch (error) {
        return handleCustomThrow(res, error)
    }
}
