import mongoose from '../../db';
const isValidObjectId = value => mongoose.Types.ObjectId.isValid(value);

export function validateLogin(req) {
    req.checkBody('email', 'Email is required/invalid').isEmail().exists();
    req.checkBody('name', 'name is required/invalid').notEmpty();
    req.checkBody('deviceType', 'Device Type is required/invalid').isIn(['android', 'ios']);
    req.checkBody('deviceToken', 'Device Token is required/invalid').notEmpty();
    return req.validationErrors();
}
export function validateOtpVerify(req) {
    req.checkBody('email', 'Email is required/invalid').isEmail().exists();
    req.checkBody('otp', 'otp is required/invalid').notEmpty();
    return req.validationErrors();
}

export const validateProject = (req) => {
    req.checkBody('name', 'name is required/invalid').notEmpty();
    req.checkBody('bedRooms', 'bedRooms is required/invalid').notEmpty();
    req.checkBody('bathRooms', 'bathRooms is required/invalid').notEmpty();
    req.checkBody('masterBedRooms', 'masterBedRooms is required/invalid').notEmpty();
    req.checkBody('masterBaths', 'masterBaths is required/invalid').notEmpty();
    req.checkBody('livingRooms', 'livingRooms is required/invalid').notEmpty();
    req.checkBody('diningRooms', 'diningRooms is required/invalid').notEmpty();
    req.checkBody('kitchens', 'kitchens is required/invalid').notEmpty();
    req.checkBody('offices', 'offices is required/invalid').notEmpty();
    req.checkBody('garages', 'garages is required/invalid').notEmpty();
    return req.validationErrors();
}
export const validateRoom = (req) => {
    req.checkBody('name', 'name is required/invalid').notEmpty();
    req.checkBody('windowCount', 'windowCount is required/invalid').notEmpty();
    req.checkBody('projectId', 'projectId is required/invalid').custom(isValidObjectId);
    return req.validationErrors();
}
export const validateWindow = (req) => {
    req.checkBody('projectId', 'projectId is required/invalid').custom(isValidObjectId);
    req.checkBody('roomId', 'roomId is required/invalid').custom(isValidObjectId);
    req.checkBody('name', 'name is required/invalid').notEmpty();
    req.checkBody('width', 'width is required/invalid').notEmpty();
    req.checkBody('height', 'height is required/invalid').notEmpty();
    req.checkBody('openingUnit', 'openingUnit is required/invalid').isIn(['1', '2', '3', '4']);
    req.checkBody('shape', 'shape is required/invalid').isIn(['singleHung', 'doubleHung', 'sliding', 'picture', 'awning', 'bay', 'casement', 'specialShape']);
    req.checkBody('features', 'features is required/invalid').isArray();
    req.checkBody('image', 'image is required/invalid').isArray();
    req.checkBody('note', 'note is required/invalid').notEmpty();
    return req.validationErrors();
}
