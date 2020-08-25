import { } from './_requestValidators';
import { sendResponse, handleCustomThrow } from '../../utils/sendResponse';
import { Education } from '../../models'


/*
show all the active education list 
*/
export const listEducation = async (req, res) => {
    try {
        let limit = 10;
        let page = req.query.page ? req.query.page : 0
        let education = await Education.find({ status: '1' }).skip(limit * page).limit(limit);

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

/*
by using this function we can favorite or unfavorite 
*/
export const educationFavorite = async (req, res) => {
    try {
        let education = await Education.findOne({ _id: req.params.id })

        let index = education.favoriteBy.map(value => value.childId).indexOf(req.user._id)
        if (index != -1) {
            education.favoriteBy.splice(index, 1)
        } else {
            education.favoriteBy.push({ childId: req.user._id })
        }
        await education.save();
        sendResponse(
            res,
            200,
            {},
            "Education favorite/unfavorite done "
        )
    } catch (error) {
        return handleCustomThrow(res, error);
    }

}
