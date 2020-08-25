import { } from './_requestValidators';
import { sendResponse, handleCustomThrow } from '../../utils/sendResponse';
import { Card } from "../../models";



/*
This function is responsible for creating the user saved card
*/
export const listStripeCard = async (req, res) => {
    try {
        let cardList = await Card.find({ parentId: req.user._id }).sort({ 'createdAt': -1 })

        return sendResponse(res, 200, cardList, "Card list")
    } catch (error) {
        return handleCustomThrow(res, error);
    }
}