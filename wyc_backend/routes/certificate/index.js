const verifyToken = require('../../middleware/verifyToken');
const add = require('./add');
const get = require('./get');
const list = require('./list')


module.exports = (server) => {
    server.post('/v1/certificate', verifyToken, add);
    server.get('/v1/certificate', verifyToken, get);
    server.get('/v1/certificate/list', verifyToken, list);
};

