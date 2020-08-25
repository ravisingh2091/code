import mongoose from '../../db';
const isValidObjectId = value => mongoose.Types.ObjectId.isValid(value);

export function validateAddChildPayload(req) {
    req.checkBody('firstName', 'firstName is required/invalid').notEmpty();
    req.checkBody('email', 'Email is required/invalid').isEmail().exists();
    req.checkBody('age', 'age is required/invalid').notEmpty();
    req.checkBody('password', 'password is required/invalid/less than 5 chars').isLength({ min: 5 }).exists();
    req.checkBody('personisalizedCardId', 'personisalizedCardId is required/invalid').custom(isValidObjectId);
    req.checkBody('deviceType', 'deviceType is required/invalid').isIn(['android', 'ios']);
    return req.validationErrors();
}

export function validateOtpVerifyForChildPayload(req) {
    req.checkBody('firstName', 'firstName is required/invalid').notEmpty();
    req.checkBody('email', 'Email is required/invalid').isEmail().exists();
    req.checkBody('age', 'age is required/invalid').notEmpty();
    req.checkBody('password', 'password is required/invalid/less than 5 chars').isLength({ min: 5 }).exists();
    req.checkBody('personisalizedCardId', 'personisalizedCardId is required/invalid').custom(isValidObjectId);
    req.checkBody('deviceType', 'deviceType is required/invalid').isIn(['android', 'ios']);
    req.checkBody('otp', 'otp is required/invalid').notEmpty();
    return req.validationErrors();
}
export function validateChildNewCardActivate(req) {
    req.checkBody('address', 'address is required/invalid').notEmpty();
    req.checkBody('personisalizedCardId', 'personisalizedCardId is required/invalid').custom(isValidObjectId);
    req.checkBody('childId', 'childId is required/invalid').custom(isValidObjectId);
    return req.validationErrors();
}

export function validateSetupPaymentMethod(req) {
    req.checkBody('cardHolderName', 'cardHolderName is required/invalid').notEmpty();
    req.checkBody('cardNumber', 'cardNumber is required/invalid').notEmpty();
    req.checkBody('expDate', 'expDate is required/invalid').notEmpty();
    req.checkBody('cvv', 'cvv is required/invalid').notEmpty();
    return req.validationErrors();
}

export function validateSeachParent(req) {
    req.checkBody('value', 'email is required/invalid').notEmpty();
    return req.validationErrors();
}

export function validateRewardSend(req) {
    req.checkBody('childId', 'childId is required/invalid').custom(isValidObjectId);
    req.checkBody('taskId', 'taskId is required/invalid').custom(isValidObjectId);
    req.checkBody('bonus', 'bonus is required/invalid').notEmpty();
    return req.validationErrors();
}

export function validateAddBalanceToChildCard(req) {
    req.checkBody('childId', 'childId is required/invalid').custom(isValidObjectId);
    req.checkBody('amount', 'amount is required/invalid').notEmpty();
    req.checkBody('message', 'message is required/invalid').notEmpty();
    return req.validationErrors();
}

export function validateChildLimitPayload(req) {
    req.checkBody('childData', 'childData is required/invalid').isArray()
    return req.validationErrors();
}

export function validateChildAllowanceSet(req) {
    req.checkBody('allowance', 'allowance is required/invalid').isArray()
    return req.validationErrors();
}

export function validateAddTaskPayload(req) {
    req.checkBody('taskName', 'taskName is required/invalid').notEmpty();
    req.checkBody('taskDescription', 'taskDescription is required/invalid').notEmpty();
    req.checkBody('childArray', 'childArray is required/invalid').isArray();
    req.checkBody('repeat', 'repeat is required/invalid').isIn(['0', '1', '2', '3']);
    req.checkBody('dueDate', 'dueDate is required/invalid').notEmpty();
    req.checkBody('dueDays', 'dueDays is required/invalid').notEmpty();
    return req.validationErrors();
}

export function validateAddBadge(req) {
    req.checkBody('image', 'image is required/invalid').notEmpty();
    req.checkBody('title', 'title is required/invalid').notEmpty();
    req.checkBody('description', 'description is required/invalid').notEmpty();
    req.checkBody('category', 'category is required/invalid').notEmpty();
    req.checkBody('childArray', 'childArray is required/invalid').isArray();
    req.checkBody('timer', 'timer is required/invalid').notEmpty();
    return req.validationErrors();
}

export function validateRewardSendBadge(req) {
    req.checkBody('childId', 'childId is required/invalid').custom(isValidObjectId);
    req.checkBody('badgeId', 'badgeId is required/invalid').custom(isValidObjectId);
    return req.validationErrors();
}

export function validateAddSaving(req) {
    // req.checkBody('image', 'image is required/invalid').notEmpty();
    req.checkBody('wishlistName', 'wishlistName is required/invalid').notEmpty();
    req.checkBody('amountNeeded', 'amountNeeded is required/invalid').notEmpty();
    return req.validationErrors();
}
export function validateTransferToSavingCategory(req) {
    req.checkBody('savingId', 'savingId is required/invalid').custom(isValidObjectId);
    req.checkBody('amountSave', 'amountSave is required/invalid').notEmpty();
    return req.validationErrors();
}
export function validateTransferToDefaultCategory(req) {
    req.checkBody('savingId', 'savingId is required/invalid').custom(isValidObjectId);
    req.checkBody('amountDefault', 'amountDefault is required/invalid').notEmpty();
    return req.validationErrors();
}

export function validateAddEventPayload(req) {
    req.checkBody('eventName', 'eventName is required/invalid').notEmpty();
    req.checkBody('eventDescription', 'eventDescription is required/invalid').notEmpty();
    req.checkBody('location', 'location is required/invalid').notEmpty();
    req.checkBody('eventTimeDate', 'eventTimeDate is required/invalid').notEmpty();
    req.checkBody('date', 'date is required/invalid').notEmpty();
    req.checkBody('time', 'time is required/invalid').notEmpty();
    return req.validationErrors();
}

export function validateAcceptEvent(req) {
    req.checkBody('eventId', 'eventId is required/invalid').custom(isValidObjectId);
    req.checkBody('acceptStatus', 'acceptStatus is required/invalid').isIn(['1', '2', '3']);
    return req.validationErrors();
}

export function validateAcceptTask(req) {
    req.checkBody('taskId', 'taskId is required/invalid').custom(isValidObjectId);
    req.checkBody('acceptStatus', 'acceptStatus is required/invalid').isIn(['1', '0']);;
    return req.validationErrors();
}

export function validateNotificationRead(req) {
    req.checkBody('notificationId', 'notificationId is required/invalid').custom(isValidObjectId);
    return req.validationErrors();
}

export function validateTxtReactionList(req) {
    req.checkQuery('childId', 'childId is required/invalid').custom(isValidObjectId);
    return req.validationErrors();
}

export function validateaddTxtReaction(req) {
    req.checkBody('childId', 'childId is required/invalid').notEmpty();
    req.checkBody('transactionId', 'transactionId is required/invalid').notEmpty();
    req.checkBody('parentEmoji', 'parentEmoji is required/invalid').notEmpty();
    req.checkBody('parentMessage', 'parentMessage is required/invalid').notEmpty();
    return req.validationErrors();
}

export function validateAddTxtReactionForChild(req) {
    req.checkBody('reactionId', 'reactionId is required/invalid').notEmpty();
    req.checkBody('childEmoji', 'childEmoji is required/invalid').notEmpty();
    req.checkBody('childMessage', 'childMessage is required/invalid').notEmpty();
    return req.validationErrors();
}

export function validateChatList(req) {
    req.checkQuery('roomId', 'roomId is required/invalid').custom(isValidObjectId);
    req.checkQuery('page', 'page is required/invalid').notEmpty();
    return req.validationErrors();
}



export function validatePayGift(req) {
    req.checkBody('tokenId', 'tokenId is required/invalid').notEmpty();
    req.checkBody('name', 'name is required/invalid').notEmpty();
    req.checkBody('child', 'child is required/invalid').notEmpty();
    req.checkBody('email', 'email is required/invalid').notEmpty();
    req.checkBody('phone', 'phone is required/invalid').notEmpty();
    req.checkBody('amount', 'amount is required/invalid').notEmpty();
    req.checkBody('message', 'message is required/invalid').notEmpty();
    req.checkBody('from', 'from is required/invalid').notEmpty();
    return req.validationErrors();
}

export function validateGenerateIPIN(req) {
    req.checkBody('ipin', 'ipin is required/invalid').notEmpty().isInt().isLength({ min: 6 });
    req.checkBody('otp', 'otp is required/invalid').notEmpty().isInt().isLength({ min: 4 });
    return req.validationErrors();
}

export function validateAddReview(req) {
    req.checkBody('name', 'name is required/invalid').exists();
    req.checkBody('email', 'email is required/invalid/').exists();
    req.checkBody('image', 'image is required/invalid/').exists();
    req.checkBody('comment', 'comment is required/invalid/').exists();
    req.checkBody('rating', 'rating is required/invalid/').exists();
    return req.validationErrors();
}