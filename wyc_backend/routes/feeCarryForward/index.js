const verifyToken = require('../../middleware/verifyToken');
const add = require('./add');
const del = require('./del');
const list = require('./list');
const update = require('./update');
const get = require('./get');


module.exports = (server) => {
    server.post('/v1/fee/carry/forward', verifyToken, add);
    server.delete('/v1/fee/carry/forward', verifyToken, del);
    server.get('/v1/fee/carry/forward', verifyToken, list);
     server.get('/v1/get/fee/carry/forward', verifyToken, get);
      server.put('/v1/fee/carry/forward', verifyToken, update);
};
