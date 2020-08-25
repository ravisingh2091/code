const verifyToken = require('../../middleware/verifyToken');
const list = require('./list');

module.exports = (server) => {
    server.get('/v1/religion', verifyToken, list);
};
