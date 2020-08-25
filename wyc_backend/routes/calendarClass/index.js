const verifyToken = require('../../middleware/verifyToken');
const add = require('./add');
const assignEmpCalendar = require('./addEmpCalendar');
const list = require('./list');

module.exports = (server) => {
    server.post('/v1/calendar/class', verifyToken, add);
    server.put('/v1/calendar/employee', verifyToken, assignEmpCalendar);
    server.get('/v1/calendar/class', verifyToken, list);
};
