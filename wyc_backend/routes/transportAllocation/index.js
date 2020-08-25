const verifyToken = require('../../middleware/verifyToken');
const allocateStudent = require('./allocateStudent');
const allocateTeacher = require('./allocateTeacher');
const routeReport = require('./routeReport');
const routeUser = require('./routeUser');
const sectionReport = require('./sectionReport');
const sectionUser = require('./sectionUser');
const stopReport = require('./stopReport');
const transportReport = require('./transportReport');
const vehicleReport = require('./vehicleReport');

module.exports = (server) => {
    server.post('/v1/trans/allocate/student', verifyToken, allocateStudent);
    server.post('/v1/trans/allocate/teacher', verifyToken, allocateTeacher);
    server.get('/v1/trans/route/report', verifyToken, routeReport);
    server.get('/v1/trans/route/user', verifyToken, routeUser);
    server.get('/v1/trans/section/report', verifyToken, sectionReport);
    server.get('/v1/trans/section/user', verifyToken, sectionUser);
    server.get('/v1/trans/stop/report', verifyToken, stopReport);
    server.get('/v1/trans/student/report', verifyToken, transportReport);
    server.get('/v1/trans/vehicle/report', verifyToken, vehicleReport);
};
