const verifyToken = require('../../middleware/verifyToken');
const add = require('./add');
const del = require('./del');
const list = require('./list');
const transdiscount = require('./transdiscount');

module.exports = (server) => {
    server.post('/v1/transport/discount', verifyToken, add);
    server.delete('/v1/transport/discount', verifyToken, del);
    server.get('/v1/transport/discount', verifyToken, list);
    server.get('/v1/transport/get/discount', verifyToken, transdiscount);
};
