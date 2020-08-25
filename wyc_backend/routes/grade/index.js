const verifyToken = require('../../middleware/verifyToken');
const add = require('./add');
const list = require('./list');
const update = require('./update');
const del = require('./del');
module.exports = (server) => {
   server.post('/v1/grade', verifyToken, add);
   server.get('/v1/grade', verifyToken, list);
   server.put('/v1/grade', verifyToken, update);
   server.delete('/v1/grade', verifyToken, del);
};