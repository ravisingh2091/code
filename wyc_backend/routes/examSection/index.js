const verifyToken = require('../../middleware/verifyToken');
const add = require('./add');
const classSectionPattern = require('./classSectionPattern');
const list = require('./list');
const update = require('./update');

module.exports = (server) => {
    server.post('/v1/exam/section', verifyToken, add);
    server.get('/v1/class/section/pattern', verifyToken, classSectionPattern);
    server.get('/v1/exam/section', verifyToken, list);
    server.put('/v1/exam/section', verifyToken, update);
};
