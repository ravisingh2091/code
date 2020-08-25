import mongoose from '../../db';
const isValidObjectId = value => mongoose.Types.ObjectId.isValid(value);


export function validateLoginPayload(req) {
    req.checkBody('email', 'Email is required/invalid').isEmail().exists();
    req.checkBody('password', 'password is required/invalid').notEmpty();
    return req.validationErrors();
}

export function validateAdminChangePasswordPayload(req) {
    req.checkBody('oldPassword', 'oldPassword is required/invalid').notEmpty();
    req.checkBody('newPassword', 'newPassword is required/invalid').notEmpty();
    return req.validationErrors();
}



export function validateUserStatusManagePayload(req) {
    req.checkQuery('userId', 'userId is required/invalid').custom(isValidObjectId);
    return req.validationErrors();
}

