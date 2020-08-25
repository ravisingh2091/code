import mongoose from '../../db';

const isValidObjectId = value => mongoose.Types.ObjectId.isValid(value);

export function validateUserCreationPayload(req) {
    req.checkBody('name', 'name is required/invalid').notEmpty();
    req.checkBody('email', 'Email is required/invalid').isEmail().exists();
    req.checkBody('phone', 'phone is required/invalid').notEmpty();
    req.checkBody('address', 'address is required/invalid').notEmpty();
    req.checkBody('zipCode', 'zipCode is required/invalid').notEmpty();
    req.checkBody('carModel', 'carModel is required/invalid').custom(isValidObjectId)
    req.checkBody('vehicleNumber', 'vehicleNumber is required/invalid').notEmpty();
    req.checkBody('password', 'password is required/invalid/less than 5 chars').isLength({ min: 5 }).exists();
    req.checkBody('deviceType', 'deviceType is required/invalid').isIn(['android', 'ios']);
    req.checkBody('deviceToken', 'deviceToken is required/invalid').notEmpty();
    req.checkBody('lat', 'lat is required/invalid').notEmpty();
    req.checkBody('long', 'long is required/invalid').notEmpty();
    return req.validationErrors();
}

export function validateLoginPayload(req) {
    req.checkBody('phone', 'phone is required/invalid').notEmpty();
    req.checkBody('password', 'password is required/invalid/less than 5 chars').isLength({ min: 5 }).exists();
    req.checkBody('deviceType', 'deviceType is required/invalid').isIn(['android', 'ios']);
    req.checkBody('deviceToken', 'deviceToken is required/invalid').optional();
    return req.validationErrors();
}

export function validateCheckNumberPayload(req) {
    req.checkBody('phone', 'phone is required/invalid').notEmpty();
    return req.validationErrors();
}

export function validateForgetPasswordPayload(req) {
    req.checkBody('phone', 'phone is required/invalid').notEmpty();
    req.checkBody('password', 'password is required/invalid').notEmpty();
    return req.validationErrors();
}
export function validateChangePasswordPayload(req) {
    req.checkBody('old_pass', 'old_pass is required/invalid').notEmpty();
    req.checkBody('new_pass', 'new_pass is required/invalid').notEmpty();
    return req.validationErrors();
}




