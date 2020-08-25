const verifyToken = require('../../middleware/verifyToken');
const add = require('./add');
const del = require('./del');
const get = require('./get');
const list = require('./list');
const login = require('./login');
const update = require('./update');

module.exports = (server) => {
    server.post('/v1/vehicle', verifyToken, add);
    server.delete('/v1/vehicle', verifyToken, del);
    server.get('/v1/get/vehicle', verifyToken, get);
    server.get('/v1/vehicle', verifyToken, list);
    server.post('/v1/vehicle/login', login);
    server.put('/v1/vehicle', update);
};
