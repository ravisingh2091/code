import {
    validateCreateCarModePayload,

} from './_requestValidators';
import { sendResponse, handleCustomThrow } from '../../utils/sendResponse';
import { CarModel } from "../../models";



export const createCarMode = async (req, res) => {
    try {
        const errors = validateCreateCarModePayload(req);
        if (errors) {
            return sendResponse(res, 400, {}, errors[0].msg);
        }

        let carModel = await (new CarModel(req.body).save())

        return sendResponse(res, 200, carModel, "Car Model created successfully");

    } catch (error) {
        return handleCustomThrow(res, error);
    }
}
export const listCarModel = async (req, res) => {
    try {

        let carModel = await CarModel.find({ status: '1' })

        return sendResponse(res, 200, carModel, "List of Car Model");

    } catch (error) {
        return handleCustomThrow(res, error);
    }
}

