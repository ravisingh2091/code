const verifyToken = require('../../middleware/verifyToken');
const list = require('./list');
const readyState = require('./readyState');
const publish = require('./publish');

module.exports = (server) => {
    server.get('/v1/test/result', verifyToken, list);
    server.get('/v1/test/ready/state', verifyToken, readyState);
    server.post('/v1/test/result/publish', verifyToken, publish);
};
