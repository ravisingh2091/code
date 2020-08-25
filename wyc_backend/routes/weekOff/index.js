const verifyToken = require('../../middleware/verifyToken');
const add = require('./add');
const del = require('./del');
const get = require('./get');
const getEmpWeekOff = require('./getEmpWeekOff');
const list = require('./list');

module.exports = (server) => {
    server.post('/v1/calendar/weekoff', verifyToken, add);
    server.delete('/v1/calendar/weekoff/:id', verifyToken, del);
    server.get('/v1/student/weekoff/:classId', verifyToken, get);
    server.get('/v1/weekoff/employee', verifyToken, getEmpWeekOff);
    server.get('/v1/calendar/weekoff/:calendar_id', verifyToken, list);
};
