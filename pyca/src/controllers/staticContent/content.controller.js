import {
    validateGetContentPayload,
    validateAddContentPayload,
    validateUpdateContent
} from './_requestValidators';
import { sendResponse, handleCustomThrow } from '../../utils/sendResponse';
import { Content, Contact } from "../../models";


export const createContent = async (req, res) => {
    try {
        const errors = validateAddContentPayload(req);
        if (errors) {
            return sendResponse(res, 404, {}, errors[0].msg);
        }

        await (new Content(req.body).save())

        sendResponse(
            res,
            200,
            {},
            'Content created successfully'
        );
    } catch (error) {
        return handleCustomThrow(res, error)
    }
}

export const getContent = async (req, res) => {
    try {
        const errors = validateGetContentPayload(req);
        if (errors) {
            return sendResponse(res, 404, {}, errors[0].msg);
        }
        let content = await Content.findOne({ type: req.query.type });
        sendResponse(
            res,
            200,
            content,
            'Content details found successfully'
        );
    } catch (error) {
        return handleCustomThrow(res, error)
    }
}

export const listContent = async (req, res) => {
    try {
        let content
        if (req.query.id) {
            content = await Content.findOne({ _id: req.query.id })
        } else {
            content = await Content.find()
        }

        sendResponse(
            res,
            200,
            content,
            "Content List"
        )

    } catch (error) {
        return handleCustomThrow(res, error)
    }
}

export const updateContent = async (req, res) => {
    try {
        const errors = validateUpdateContent(req);
        if (errors) {
            return sendResponse(res, 404, {}, errors[0].msg);
        }
        console.log(req.body)
        await Content.updateOne({ _id: req.params.id }, req.body)

        sendResponse(
            res,
            200,
            {},
            'Content updated successfully'
        );
    } catch (error) {
        return handleCustomThrow(res, error)
    }
}