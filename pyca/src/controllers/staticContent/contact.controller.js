import { validateContactUsPayload } from './_requestValidators';
import { sendResponse, handleCustomThrow } from '../../utils/sendResponse';
import { Contact } from "../../models";

export const contactUs = async (req, res) => {
    try {
        const errors = validateContactUsPayload(req);
        if (errors) {
            return sendResponse(res, 404, {}, errors[0].msg);
        }
        let dataToSave = req.body
        dataToSave.userId = req.user._id;
        await (new Contact(dataToSave).save())
        sendResponse(
            res,
            200,
            {},
            'Contact created successfully'
        );
    } catch (error) {
        return handleCustomThrow(res, error)
    }
}
export const contactUsList = async (req, res) => {
    try {

        let query = req.query
        let limit = 10
        let skip = query.page ? +query.page - 1 : 0

        let contactList = await Contact.aggregate([
            {
                "$facet": {
                    "totalData": [
                        {
                            $lookup: {
                                from: "users",
                                localField: "userId",
                                foreignField: "_id",
                                as: "users"
                            }
                        },
                        {
                            $unwind: '$users'
                        },
                        { "$skip": skip * limit },
                        { "$limit": limit }
                    ],
                    "totalCount": [
                        {
                            "$group": {
                                "_id": null,
                                "count": { "$sum": 1 }
                            }
                        }
                    ]
                }
            }
        ])
        sendResponse(
            res,
            200,
            contactList,
            'Contact list'
        );
    } catch (error) {
        return handleCustomThrow(res, error)
    }
}