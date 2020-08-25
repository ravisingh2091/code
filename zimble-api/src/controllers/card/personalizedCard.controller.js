import {
    validateCreateCardPayload,
} from './_requestValidators';
import { sendResponse, handleCustomThrow } from '../../utils/sendResponse';
import { PersonalizedCard } from "../../models";

/*
This function is responsible for creating the Zimble card
*/
export const createCard = async (req, res) => {
    try {
        const errors = validateCreateCardPayload(req);
        if (errors) {
            return sendResponse(res, 400, {}, errors[0].msg);
        }

        await (new PersonalizedCard(req.body).save())
        return sendResponse(res, 200, {}, "Card added successfully")
    } catch (error) {
        return handleCustomThrow(res, error);
    }
}

/*
This function is responsible for listing the Zimble card
*/
export const listCard = async (req, res) => {
    try {

        let cardList = await PersonalizedCard.find({ status: '1' }).sort({ 'createdAt': -1 })
        return sendResponse(res, 200, cardList, "Card list")
    } catch (error) {
        return handleCustomThrow(res, error);
    }
}