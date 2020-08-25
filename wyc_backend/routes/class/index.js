const verifyToken = require('../../middleware/verifyToken');
const add = require('./add');
const del = require('./del');
const get = require('./get');
const list = require('./list');
const update = require('./update');
const viewClass = require('./viewClass');

module.exports = (server) => {
    server.post('/v1/class', verifyToken, add);
    server.delete('/v1/class', verifyToken, del);
    server.get('/v1/get/class/:id', verifyToken, get);
    server.get('/v1/class', verifyToken, list);
    server.put('/v1/class', verifyToken, update);
    server.get('/v1/view/class', verifyToken, viewClass);
};
