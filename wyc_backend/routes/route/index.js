const verifyToken = require('../../middleware/verifyToken');
const add = require('./add');
const del = require('./del');
const get = require('./get');
const list = require('./list');
const update = require('./update');

module.exports = (server) => {
    server.post('/v1/route', verifyToken, add);
    server.delete('/v1/route', verifyToken, del);
    server.get('/v1/get/route', verifyToken, get);
    server.get('/v1/route', verifyToken, list);
    server.put('/v1/route', verifyToken, update);
};
