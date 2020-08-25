const verifyToken = require('../../middleware/verifyToken');
const add = require('./add');
const del = require('./del');
const get = require('./get');
const list = require('./list');
const update = require('./update');

module.exports = (server) => {
    server.post('/v1/house', verifyToken, add);
    server.delete('/v1/house/:id', verifyToken, del);
    server.get('/v1/house/:id', verifyToken, get);
    server.get('/v1/house', verifyToken, list);
    server.put('/v1/house', verifyToken, update);
};
