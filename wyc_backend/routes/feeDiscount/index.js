const verifyToken = require('../../middleware/verifyToken');
const add = require('./add');
const del = require('./del');
const list = require('./list');
const feediscount = require('./feediscount');

module.exports = (server) => {
    server.post('/v1/fee/discount', verifyToken, add);
    server.delete('/v1/fee/discount', verifyToken, del);
    server.get('/v1/fee/discount', verifyToken, list);
    server.get('/v1/get/discount', verifyToken, feediscount);
};

