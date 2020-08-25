const verifyToken = require('../../middleware/verifyToken');
const add = require('./add');
const list = require('./list');

module.exports = (server) => {
    server.post('/v1/calendar', verifyToken, add);
    server.get('/v1/calendar', verifyToken, list);
};
