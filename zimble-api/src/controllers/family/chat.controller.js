import { sendResponse, handleCustomThrow } from '../../utils/sendResponse';
import { User, Chat } from "../../models";
import { validateChatList } from './_requestValidators';

/*
This function is used to list all the child list of the parent 
*/
export const roomList = async (req, res) => {
    try {

        let parentId = req.user._id;
        let childs = await User.find({ parentId, status: '1' })
        let rooms = []
        for (let child of childs) {
            let lastMessage = await Chat.findOne({ roomId: child._id }).sort({ 'createdAt': -1 })
            rooms.push({
                _id: child._id,
                name: child.firstName,
                profilePicture: child.profilePicture,
                msg: lastMessage ? lastMessage.message : '',
                msgDate: lastMessage ? lastMessage.createdAt : ''
            })
        }

        sendResponse(
            res,
            200,
            rooms,
            "Room list"
        )

    } catch (error) {
        return handleCustomThrow(res, error)
    }
}


/*
By using this function we can get the child room list
*/
export const childRoomList = async (req, res) => {
    try {

        let lastMessage = await Chat.findOne({ roomId: req.user._id }).sort({ 'createdAt': -1 })
        let rooms = {
            _id: req.user._id,
            parentId: req.parent._id,
            name: req.parent.firstName,
            profilePicture: req.parent.profilePicture,
            msg: lastMessage ? lastMessage.message : '',
            msgDate: lastMessage ? lastMessage.createdAt : ''
        }

        sendResponse(
            res,
            200,
            rooms,
            "Child Room list"
        )

    } catch (error) {
        return handleCustomThrow(res, error)
    }
}
/*
this function is used to get the chat list of the particular user
*/
export const chatList = async (req, res) => {
    try {
        const errors = validateChatList(req);
        if (errors) {
            return sendResponse(res, 400, {}, errors[0].msg);
        }

        let page = req.query.page ? req.query.page : 0;
        let limit = 10
        let chats = await Chat.find({ "roomId": req.query.roomId }).skip(page * limit).limit(limit).sort({ "createdAt": -1 });

        sendResponse(
            res,
            200,
            chats,
            "chat list"
        )
    } catch (error) {
        return handleCustomThrow(res, error)
    }
}