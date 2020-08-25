
export function validateLoginPayload(req) {
    req.checkBody('email', 'Email is required/invalid').isEmail().exists();
    req.checkBody('password', 'password is required/invalid/less than 5 chars').isLength({ min: 8 }).exists();
    return req.validationErrors();
}



export function validateAddCategory(req) {
    req.checkBody('name', 'name is required/invalid').exists();
    req.checkBody('image', 'image is required/invalid/').exists();
    return req.validationErrors();
}


export function validateCreateEducation(req) {
    req.checkBody('title', 'title is required/invalid').exists();
    req.checkBody('description', 'description is required/invalid').exists();
    req.checkBody('image', 'image is required/invalid').exists();
    return req.validationErrors();
}

export function validateCreateEducationTopic(req) {
    req.checkBody('name', 'name is required/invalid').exists();
    req.checkBody('type', 'type is required/invalid').exists();
    req.checkBody('icon', 'icon is required/invalid').exists();
    req.checkBody('eductionId', 'eductionId is required/invalid').exists();
    return req.validationErrors();
}

export function validateSeachParent(req) {
    req.checkBody('email', 'email is required/invalid').notEmpty();
    return req.validationErrors();
}

