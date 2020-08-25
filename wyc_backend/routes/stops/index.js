const verifyToken = require('../../middleware/verifyToken');
const add = require('./add');
const del = require('./del');
const get = require('./get');
const list = require('./list');
const stopList = require('./stopList');
const update = require('./update');

module.exports = (server) => {
    server.post('/v1/stops', verifyToken, add);
    server.delete('/v1/stop', verifyToken, del);
    server.get('/v1/get/stop', verifyToken, get);
    server.get('/v1/stops', verifyToken, list);
    server.get('/v1/stop/list', stopList);
    server.put('/v1/stops', update);
};
