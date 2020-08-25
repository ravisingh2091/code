const verifyToken = require('../../middleware/verifyToken');
const add = require('./add');
const del = require('./del');
const get = require('./get');
const list = require('./list');
const update = require('./update');

module.exports = (server) => {
    server.post('/v1/fuel/consumption', add);
    server.delete('/v1/fuel/consumption', verifyToken, del);
    server.get('/v1/get/fuel/consumption', get);
    server.get('/v1/fuel/consumption', verifyToken, list);
    server.put('/v1/fuel/consumption', verifyToken, update);
};
