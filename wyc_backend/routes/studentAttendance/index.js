const verifyToken = require('../../middleware/verifyToken');
const add = require('./add');
const sectionAttendance = require('./sectionAttendance');
const sectionReport = require('./sectionReport');
const studentAttendance = require('./studentAttendance');
const studentAttendanceInfo = require('./studentAttendanceInfo');
const studentReport = require('./studentReport');
const update = require('./update');

module.exports = (server) => {
    server.post('/v1/student/attendance', verifyToken, add);
    server.get('/v1/section/attendance', verifyToken, sectionAttendance);
    server.get('/v1/attendance/section/report', verifyToken, sectionReport);
    server.get('/v1/student/attendance/:studentId', verifyToken, studentAttendance);
    server.get('/v1/student/attendance', verifyToken, studentAttendanceInfo);
    server.get('/v1/attendance/student/report', verifyToken, studentReport);
    server.put('/v1/student/attendance', verifyToken, update);
};
