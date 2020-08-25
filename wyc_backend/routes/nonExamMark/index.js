const verifyToken = require('../../middleware/verifyToken');
const add = require('./add');
const get = require('./get');
const list = require('./list');
const update = require('./update');

module.exports = (server) => {
    server.post('/v1/nonexam/mark', verifyToken, add);
    server.get('/v1/get/nonexam/mark', verifyToken, get);
    server.get('/v1/nonexam/mark', verifyToken, list);
    server.put('/v1/nonexam/mark', verifyToken, update);
};
