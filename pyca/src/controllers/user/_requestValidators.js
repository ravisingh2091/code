import mongoose from '../../db';
const isValidObjectId = value => mongoose.Types.ObjectId.isValid(value);
const isValidDate = (value) => {
    if (!value) return false
    if (!value.match(/(0[1-9]|1[012])[- -.](0[1-9]|[12][0-9]|3[01])[- -.](19|20)\d\d/)) {
        return false
    }
    return true
}
export function validateYouthAddPayload(req) {
    req.checkBody('name', 'name is required/invalid').notEmpty();
    req.checkBody('relation', 'relation is required/invalid').notEmpty();
    req.checkBody('gender', 'gender is required/invalid').isIn(['male', 'female']);
    req.checkBody('dob', 'dob is required/invalid').custom(isValidDate);
    req.checkBody('phone', 'phone is required/invalid').notEmpty();
    return req.validationErrors();
}
export function validateOfferRidePayload(req) {
    req.checkBody('fromPointLat', 'fromPointLat is required/invalid').notEmpty();
    req.checkBody('fromPointLong', 'fromPointLong is required/invalid').notEmpty();
    req.checkBody('fromPointName', 'fromPointName is required/invalid').notEmpty();
    req.checkBody('goingToPointLat', 'goingToPointLat is required/invalid').notEmpty();
    req.checkBody('goingToPointLong', 'goingToPointLong is required/invalid').notEmpty();
    req.checkBody('goingToPointName', 'goingToPointName is required/invalid').notEmpty();
    req.checkBody('dateTimeMilliSecond', 'dateTimeMilliSecond is required/invalid').notEmpty();
    req.checkBody('dateAndTime', 'dateAndTime is required/invalid').notEmpty();
    req.checkBody('availableSeat', 'availableSeat is required/invalid').notEmpty();
    return req.validationErrors();
}
export function validateRequestRidePayload(req) {
    req.checkBody('fromPointLat', 'fromPointLat is required/invalid').notEmpty();
    req.checkBody('fromPointLong', 'fromPointLong is required/invalid').notEmpty();
    req.checkBody('fromPointName', 'fromPointName is required/invalid').notEmpty();
    req.checkBody('goingToPointLat', 'goingToPointLat is required/invalid').notEmpty();
    req.checkBody('goingToPointLong', 'goingToPointLong is required/invalid').notEmpty();
    req.checkBody('goingToPointName', 'goingToPointName is required/invalid').notEmpty();
    req.checkBody('dateTimeMilliSecond', 'dateTimeMilliSecond is required/invalid').notEmpty();
    req.checkBody('dateAndTime', 'dateAndTime is required/invalid').notEmpty();
    req.checkBody('seatRequired', 'seatRequired is required/invalid').notEmpty();
    req.checkBody('youthId', 'youthId is required/invalid').isArray();
    req.checkBody('offeredById', 'offeredById is required/invalid').custom(isValidObjectId);
    req.checkBody('offeredId', 'offeredId is required/invalid').custom(isValidObjectId);
    return req.validationErrors();
}
export function validateRequestedRideSearchPayload(req) {
    req.checkBody('fromPointLat', 'fromPointLat is required/invalid').notEmpty();
    req.checkBody('fromPointLong', 'fromPointLong is required/invalid').notEmpty();
    req.checkBody('goingToPointLat', 'goingToPointLat is required/invalid').notEmpty();
    req.checkBody('goingToPointLong', 'goingToPointLong is required/invalid').notEmpty();
    req.checkBody('dateTimeMilliSecond', 'dateTimeMilliSecond is required/invalid').notEmpty();
    req.checkBody('dateAndTime', 'dateAndTime is required/invalid').notEmpty();
    req.checkBody('requiredSeat', 'requiredSeat is required/invalid').notEmpty();
    return req.validationErrors();
}
export function validateMyRidePayload(req) {
    req.checkQuery('rideHistoryType', 'rideHistoryType is required/invalid').isIn(['ongoing', 'schedule', 'past']);
    return req.validationErrors();
}
export function validateRideDetailsPayload(req) {
    req.checkQuery('rideId', 'rideId is required/invalid').custom(isValidObjectId);
    req.checkQuery('rideType', 'rideType is required/invalid').isIn(['offered', 'requested']);
    return req.validationErrors();
}

export function validateRideStatusPayload(req) {
    req.checkBody('requestedId', 'requestedId is required/invalid').custom(isValidObjectId);
    req.checkBody('rideStatus', 'rideStatus is required/invalid').isIn(['1', '2', '3', '4']);
    return req.validationErrors();
}
export function validateRideStatusByOfferedId(req) {
    req.checkBody('OfferedId', 'OfferedId is required/invalid').custom(isValidObjectId);
    return req.validationErrors();
}


export function validateAllMemeberListPayload(req) {
    req.checkQuery('memberType', 'memberType is required/invalid').isIn(['all', 'connected']);
    return req.validationErrors();
}
export function validateConnecteMemeberListPayload(req) {
    req.checkQuery('memberId', 'memberId is required/invalid').custom(isValidObjectId);
    return req.validationErrors();
}
export function validateChatListPayload(req) {
    req.checkQuery('roomId', 'roomId is required/invalid').custom(isValidObjectId);
    return req.validationErrors();
}

export function validateSchedule(req) {
    req.checkBody('fromPointLat', 'fromPointLat is required/invalid').notEmpty();
    req.checkBody('fromPointLong', 'fromPointLong is required/invalid').notEmpty();
    req.checkBody('fromPointName', 'fromPointName is required/invalid').notEmpty();
    req.checkBody('goingToPointLat', 'goingToPointLat is required/invalid').notEmpty();
    req.checkBody('goingToPointLong', 'goingToPointLong is required/invalid').notEmpty();
    req.checkBody('goingToPointName', 'goingToPointName is required/invalid').notEmpty();
    req.checkBody('dateTimeMilliSecond', 'dateTimeMilliSecond is required/invalid').notEmpty();
    req.checkBody('dateAndTime', 'dateAndTime is required/invalid').notEmpty();
    req.checkBody('youthId', 'youthId is required/invalid').notEmpty();
    req.checkBody('dayName', 'dayName is required/invalid').notEmpty();
    return req.validationErrors();
}
