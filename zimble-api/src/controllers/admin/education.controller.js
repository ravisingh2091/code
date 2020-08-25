import { validateCreateEducation, validateCreateEducationTopic } from './_requestValidators';
import { sendResponse, handleCustomThrow } from '../../utils/sendResponse';
import { Education } from '../../models'


// this function is used to add eduction
export const createEducation = async (req, res) => {
    try {
        const errors = validateCreateEducation(req);
        if (errors) {
            return sendResponse(res, 400, {}, errors[0].msg);
        }
        let education = await (new Education(req.body)).save();

        sendResponse(
            res,
            200,
            education,
            "Education Created successfully"
        )
    } catch (error) {
        return handleCustomThrow(res, error);
    }
}

// this function is used to update eduction
export const updateEducation = async (req, res) => {
    try {
        let _id = req.body._id;
        delete req.body._id
        let education = await Education.findOneAndUpdate({ _id }, req.body, { new: true });

        sendResponse(
            res,
            200,
            education,
            "Education Created successfully"
        )
    } catch (error) {
        return handleCustomThrow(res, error);
    }
}

// this function is used to list eduction
export const listEducation = async (req, res) => {
    try {

        let education = await Education.find({
            status: { $in: ['0', '1'] }
        }, { title: 1, description: 1, image: 1, status: 1, preview: 1 });

        sendResponse(
            res,
            200,
            education,
            "Education list "
        )
    } catch (error) {
        return handleCustomThrow(res, error);
    }
}

// this function is used to get the eduction details
export const educationDetail = async (req, res) => {
    try {
        let education = await Education.findOne({ _id: req.params.id });
        sendResponse(
            res,
            200,
            education,
            "Education detail"
        )
    } catch (error) {
        return handleCustomThrow(res, error);
    }
}

// this function is used to add the education topic 
export const createEducationTopic = async (req, res) => {
    try {
        const errors = validateCreateEducationTopic(req);
        if (errors) {
            return sendResponse(res, 400, {}, errors[0].msg);
        }

        let education = await Education.findOne({ _id: req.body.eductionId });
        education.topic.push({
            name: req.body.name,
            type: req.body.type,
            icon: req.body.icon,
        })
        await education.save();
        sendResponse(
            res,
            200,
            {},
            "Education Created successfully"
        )
    } catch (error) {
        return handleCustomThrow(res, error);
    }
}