import mongoose from '../../db';
const isValidObjectId = value => mongoose.Types.ObjectId.isValid(value);

export function validateRegister(req) {
    req.checkBody('email', 'Email is required/invalid').isEmail().exists();
    req.checkBody('firstName', 'First Name is required/invalid').notEmpty();
    req.checkBody('lastName', 'Last Name is required/invalid').notEmpty();
    req.checkBody('companyName', 'Company Name is required/invalid').notEmpty();
    req.checkBody('password', 'Password is required/invalid').notEmpty();
    return req.validationErrors();
}

export function validateLogin(req) {
    req.checkBody('email', 'Email is required/invalid').isEmail().exists();
    req.checkBody('password', 'Password is required/invalid').notEmpty();
    return req.validationErrors();
}

export function validateForgetPassword(req) {
    req.checkBody('email', 'email is required/invalid').isEmail().exists();
    return req.validationErrors();
}

export function validateEamilVerify(req) {
    req.checkQuery('v', 'Token is required/invalid').notEmpty();
    return req.validationErrors();
}
export function validateForgetChangePassword(req) {
    req.checkBody('v', 'Token is required/invalid').notEmpty();
    req.checkBody('password', 'password is required/invalid').notEmpty();
    return req.validationErrors();
}
