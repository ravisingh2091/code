const verifyToken = require('../../middleware/verifyToken');
const add = require('./add');
const get = require('./get');
const list = require('./list');
const update = require('./update');

module.exports = (server) => {
    server.post('/v1/term', verifyToken, add);
    server.get('/v1/get/term', verifyToken, get);
    server.get('/v1/term', verifyToken, list);
    server.put('/v1/term', verifyToken, update);
};
