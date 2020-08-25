const verifyToken = require('../../middleware/verifyToken');
const get = require('./get');
const list = require('./list');
const add = require('./add');
const update = require('./update');
const studentHoliday = require('./studentHoliday');
const empHoliday = require('./empHoliday');

module.exports = (server) => {
    server.get('/v1/holiday/:holiday_id', verifyToken, get);
    server.get('/v1/student/holiday/:class_id', verifyToken, studentHoliday);
    server.get('/v1/get/employee/holiday', verifyToken, empHoliday);
    server.get('/v1/holiday', verifyToken, list);
    server.post('/v1/holiday', verifyToken, add);
    server.put('/v1/holiday', verifyToken, update);
};
