
export function validateUserCreationPayload(req) {
    req.checkBody('email', 'Email is required/invalid').isEmail().exists();
    req.checkBody('password', 'Password is required/invalid/less than 5 chars').isLength({ min: 5 }).exists();
    req.checkBody('deviceType', 'Device Type is required/invalid').isIn(['android', 'ios']);
    req.checkBody('phone', 'Phone is required/invalid').notEmpty();
    req.checkBody('familyName', 'Family Name is required/invalid').notEmpty();
    req.checkBody('firstName', 'firstName is required/invalid').notEmpty();
    req.checkBody('lastName', 'lastName is required/invalid').notEmpty();
    req.checkBody('nationality', 'nationality is required/invalid').notEmpty();
    return req.validationErrors();
}

export function validateLoginPayload(req) {
    req.checkBody('email', 'Email is required/invalid').isEmail().exists();
    req.checkBody('password', 'Password is required/invalid/less than 5 chars').isLength({ min: 5 }).exists();
    req.checkBody('deviceType', 'Device Type is required/invalid').isIn(['android', 'ios']);
    req.checkBody('deviceToken', 'Device Token is required/invalid').optional();
    return req.validationErrors();
}

export function validateOtpVerifyPayload(req) {
    req.checkBody('phone', 'Phone is required/invalid').notEmpty();
    req.checkBody('otp', 'OTP is required/invalid').isLength({ min: 4 }).exists();
    req.checkBody('deviceToken', 'Device Token is required/invalid').optional();
    return req.validationErrors();
}
export function validateResendOtpPayload(req) {
    req.checkBody('phone', 'phone is required/invalid').notEmpty();
    return req.validationErrors();
}
export function validateforgetPasswordPayload(req) {
    req.checkBody('email', 'email is required/invalid').isEmail().exists();
    return req.validationErrors();
}
export function validateEamilVerifyPayload(req) {
    req.checkQuery('v', 'Token is required/invalid').notEmpty();
    return req.validationErrors();
}
export function validateForgetChangePassword(req) {
    req.checkBody('v', 'Token is required/invalid').notEmpty();
    req.checkBody('password', 'password is required/invalid').notEmpty();
    return req.validationErrors();
}



