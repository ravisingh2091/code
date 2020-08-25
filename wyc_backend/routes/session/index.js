const verifyToken = require('../../middleware/verifyToken');
const get = require('./get');
const list = require('./list');
const add = require('./add');
const update = require('./update');

module.exports = (server) => {
    server.get('/v1/session/:session_id', verifyToken, get);
    server.get('/v1/session', verifyToken, list);
    server.post('/v1/session', verifyToken, add);
    server.put('/v1/session', verifyToken, update);
};
