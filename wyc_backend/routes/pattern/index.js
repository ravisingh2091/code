const verifyToken = require('../../middleware/verifyToken');
const add = require('./add');
const get = require('./get');
const list = require('./list');

module.exports = (server) => {
    server.post('/v1/pattern', verifyToken, add);
    server.get('/v1/get/pattern', verifyToken, get);
    server.get('/v1/pattern', verifyToken, list);
};
