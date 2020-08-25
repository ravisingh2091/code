import { sendResponse } from '../utils/sendResponse';
import { decodeJWT } from '../utils/jwt';
import { User } from '../models';

const INVALID_TOKEN = 'Invalid/Missing token';

const isAuthenticated = async (req, res, next) => {
    // check req.header for token
    try {
        const token = req.header('Authorization');
        if (!token) {
            return sendResponse(res, 401, {}, INVALID_TOKEN);
        }
        const decoded = await decodeJWT({ token });
        if (!decoded.data) {
            return sendResponse(res, 401, {}, INVALID_TOKEN);
        }
        const user = await User.findOne({ userToken: token });
        if (!user) {
            return sendResponse(res, 404, {}, INVALID_TOKEN);
        }
        req.user = user;

        return next();
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
        if (err.name === 'TokenExpiredError') {
            return sendResponse(res, 401, {}, 'Token expired');
        } else if (err.name === 'JsonWebTokenError') {
            return sendResponse(res, 401, {}, INVALID_TOKEN);
        }
        return sendResponse(res, 500, {}, 'Something went wrong');
    }
};

export default isAuthenticated;
