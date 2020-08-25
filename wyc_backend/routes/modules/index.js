const verifyToken = require('../../middleware/verifyToken');
const add = require('./add');
const list = require('./list');
const update = require('./update');

module.exports = (server) => {
    server.post('/v1/module', verifyToken, add);
    server.get('/v1/module', verifyToken, list);
    server.put('/v1/module', verifyToken, update);
};
