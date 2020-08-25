
export function validateGetContentPayload(req) {
    req.checkQuery('type', 'type is required/invalid').notEmpty();
    return req.validationErrors();
}
export function validateAddContentPayload(req) {
    req.checkBody('type', 'type is required/invalid').notEmpty();
    req.checkBody('title', 'title is required/invalid').notEmpty();
    req.checkBody('content', 'content is required/invalid').notEmpty();
    return req.validationErrors();
}
export function validateUpdateContent(req) {
    req.checkBody('content', 'content is required/invalid').notEmpty();
    return req.validationErrors();
}
export function validateContactUsPayload(req) {
    req.checkBody('reason', 'reason is required/invalid').notEmpty();
    req.checkBody('email', 'email is required/invalid').isEmail().exists();;
    req.checkBody('message', 'message is required/invalid').notEmpty();
    return req.validationErrors();
}