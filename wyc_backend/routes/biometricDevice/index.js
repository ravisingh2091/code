const verifyToken = require('../../middleware/verifyToken');
const add = require('./add');
const del = require('./del');
const get = require('./get');
const list = require('./list');
const update = require('./update');

module.exports = (server) => {
    server.post('/v1/biometric/device', verifyToken, add);
    server.delete('/v1/biometric/device', verifyToken, del);
    server.get('/v1/get/biometric/device', verifyToken, get);
    server.get('/v1/biometric/device', verifyToken, list);
    server.put('/v1/biometric/device', verifyToken, update);
};
