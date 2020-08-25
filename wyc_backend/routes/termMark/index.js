const verifyToken = require('../../middleware/verifyToken');
const get = require('./get');
const publish = require('./publish');
const list = require('./list');

module.exports = (server) => {
    server.get('/v1/term/mark/info', verifyToken, get);
    server.post('/v1/term/result/publish', verifyToken, publish);
    server.get('/v1/term/mark', verifyToken, list);
};
