import mongoose from '../../db';

const isValidObjectId = value => mongoose.Types.ObjectId.isValid(value);

export function validateCreateCardPayload(req) {
    req.checkBody('title', 'title is required/invalid').notEmpty();
    req.checkBody('image', 'image is required/invalid').notEmpty();
    req.checkBody('code', 'code is required/invalid').notEmpty();
    return req.validationErrors();
}
export function validateActivateCardPayload(req) {
    req.checkBody('childId', 'childId is required/invalid').custom(isValidObjectId);
    req.checkBody('proxyCode', 'proxyCode is required/invalid').notEmpty();
    return req.validationErrors();
}
export function validateLockCardPayload(req) {
    req.checkQuery('childId', 'childId is required/invalid').custom(isValidObjectId);
    return req.validationErrors();
}

export function validateLockCard(req) {
    req.checkBody('childId', 'childId is required/invalid').custom(isValidObjectId);
    return req.validationErrors();
}