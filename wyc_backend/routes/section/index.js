const verifyToken = require('../../middleware/verifyToken');
const list = require('./list');
const add = require('./add');
const update = require('./update');

module.exports = (server) => {
    server.get('/v1/class/section', verifyToken, list);
    server.post('/v1/section', verifyToken, add);
    server.put('/v1/section', verifyToken, update); // not used
};
