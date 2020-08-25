const verifyToken = require('../../middleware/verifyToken');
const add = require('./add');
const del = require('./del');
const get = require('./get');
const list = require('./list');
const update = require('./update');

module.exports = (server) => {
    server.post('/v1/subject', verifyToken, add);
    server.delete('/v1/subject/:id', verifyToken, del);
    server.get('/v1/subject/:id', verifyToken, get);
    server.get('/v1/subject', verifyToken, list);
    server.put('/v1/subject', verifyToken, update);
};
