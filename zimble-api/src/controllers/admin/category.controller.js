import { validateAddCategory } from './_requestValidators';
import { sendResponse, handleCustomThrow } from '../../utils/sendResponse';
import { Category } from '../../models'

// this function is used to add the category 
export const addCategory = async (req, res) => {
    try {
        const errors = validateAddCategory(req);
        if (errors) {
            return sendResponse(res, 400, {}, errors[0].msg);
        }

        await (new Category(req.body).save())

        sendResponse(
            res,
            200,
            {},
            "Category Created"
        )
    } catch (error) {
        return handleCustomThrow(res, error);
    }
}

// this function is used to lsit the category
export const listCategory = async (req, res) => {
    try {
        let category = await Category.find({ status: '1' }).sort({ 'createdAt': -1 })
        sendResponse(
            res,
            200,
            category,
            "Category list"
        )
    } catch (error) {
        return handleCustomThrow(res, error);
    }
}