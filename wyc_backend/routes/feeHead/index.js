const verifyToken = require('../../middleware/verifyToken');
const get = require('./get');
const add = require('./add');
const list = require('./list');
const update = require('./update');

module.exports = (server) => {
    server.get('/v1/get/fee/head', verifyToken, get);
    server.get('/v1/fee/head', verifyToken, list);
    server.post('/v1/fee/head', verifyToken, add);
    server.put('/v1/fee/head', verifyToken, update);
};
