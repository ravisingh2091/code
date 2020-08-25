const verifyToken = require('../../middleware/verifyToken');
const add = require('./add');
const list = require('./list');

module.exports = (server) => {
    server.get('/usertype', verifyToken, list);
    server.post('/usertype', add);
};
