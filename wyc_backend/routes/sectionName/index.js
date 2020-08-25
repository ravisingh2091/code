const verifyToken = require('../../middleware/verifyToken');
const add = require('./add');
const del = require('./del');
const get = require('./get');
const list = require('./list');
const update = require('./update');

module.exports = (server) => {
    server.post('/v1/section/name', verifyToken, add);
    server.delete('/v1/section/name/:id', verifyToken, del);
    server.get('/v1/section/name/:id', verifyToken, get);
    server.get('/v1/section/name', verifyToken, list);
    server.put('/v1/section/name', verifyToken, update);
};
