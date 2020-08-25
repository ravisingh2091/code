import { } from './_requestValidators';
import { sendResponse, handleCustomThrow } from '../../utils/sendResponse';
import { Event } from '../../models'


//  this funtion is used to list the event to the admin
export const listEvent = async (req, res) => {
    try {
        let tasklist = await Event.find({}).sort({ 'createdAt': -1 })
            .populate([
                {
                    path: 'childId'
                }
            ]);
        sendResponse(
            res,
            200,
            tasklist,
            "EventList list"
        )
    } catch (error) {
        return handleCustomThrow(res, error);
    }
}