import mongoose from '../../db';
const isValidObjectId = value => mongoose.Types.ObjectId.isValid(value);

export function validateSaveStripeTokenPayload(req) {
    req.checkBody('stripeToken', 'stripeToken is required/invalid').notEmpty();
    req.checkBody('nameOnCard', 'nameOnCard is required/invalid').notEmpty();
    req.checkBody('stripeCard', 'stripeCard is required/invalid').notEmpty();
    return req.validationErrors();
}
export function validateRenewSubscription(req) {
    req.checkBody('stripeToken', 'stripeToken is required/invalid').notEmpty();
    req.checkBody('amount', 'amount is required/invalid').notEmpty();
    req.checkBody('description', 'description is required/invalid').notEmpty();
    return req.validationErrors();
}
export function validateInitialTopupPayload(req) {
    req.checkBody('amount', 'amount is required/invalid').isInt().notEmpty();
    req.checkBody('description', 'description is required/invalid').notEmpty();
    req.checkBody('cardId', 'cardId is required/invalid').custom(isValidObjectId);
    return req.validationErrors();
}

export function validateSubscribeUser(req) {
    req.checkBody('planId', 'planId is required/invalid').notEmpty();
    req.checkBody('cardId', 'cardId is required/invalid').notEmpty();
    return req.validationErrors();
}
export function validateUpdateSubscribeUser(req) {
    req.checkBody('planId', 'planId is required/invalid').notEmpty();
    return req.validationErrors();
}


