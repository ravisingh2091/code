import { validateAddReview } from './_requestValidators';
import { sendResponse, handleCustomThrow } from '../../utils/sendResponse';
import { Review } from '../../models'

// add a review by web panel 
export const addReview = async (req, res) => {
    try {
        const errors = validateAddReview(req);
        if (errors) {
            return sendResponse(res, 400, {}, errors[0].msg);
        }

        await (new Review(req.body).save())

        sendResponse(
            res,
            200,
            {},
            "Review  Created"
        )
    } catch (error) {
        return handleCustomThrow(res, error);
    }
}

// List all the review in the web home page
export const listReview = async (req, res) => {
    try {
        let review = await Review.find({ status: '1' }).sort({ 'createdAt': -1 })
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