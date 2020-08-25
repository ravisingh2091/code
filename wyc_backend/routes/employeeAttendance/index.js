const verifyToken = require('../../middleware/verifyToken');
const add = require('./add');
const get = require('./get');

module.exports = (server) => {
    server.post('/v1/employee/attendance', add);
    server.get('/v1/attendance/employee', verifyToken, get);
};
