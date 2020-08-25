const verifyToken = require('../../middleware/verifyToken');
const add = require('./add');

module.exports = (server) => {
    server.post('/v1/employee/device', verifyToken, add);
};
