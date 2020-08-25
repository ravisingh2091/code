const verifyToken = require('../../middleware/verifyToken');
const add = require('./add');
const list = require('./list');

module.exports = (server) => {
    server.post('/v1/msg/allocation', verifyToken, add);
    server.get('/v1/msg/allocation', verifyToken, list);
};
