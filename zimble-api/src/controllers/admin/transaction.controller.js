import { } from './_requestValidators';
import { sendResponse, handleCustomThrow } from '../../utils/sendResponse';
import { Transaction } from '../../models'

// list the transaction 
export const listTransaction = async (req, res) => {
    try {
        let query = req.query;
        let criteria = {}
        if (query.userType === 'parent') {
            criteria = { fromUserId: query.userId }
        } else if (query.userType === 'child') {
            criteria = { toUserId: query.userId }
        }
        let txt = await Transaction.find(criteria).sort({ createdAt: '-1' });
        sendResponse(
            res,
            200,
            txt,
            "Transaction list"
        )
    } catch (error) {
        return handleCustomThrow(res, error);
    }
}