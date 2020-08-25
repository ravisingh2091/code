const verifyToken = require('../../middleware/verifyToken');
const add = require('./add');
const del = require('./del');
const get = require('./get');

module.exports = (server) => {
    server.post('/v1/calendar/holiday', verifyToken, add);
    server.delete('/v1/calendar/holiday/:id', verifyToken, del);
    server.get('/v1/calendar/holiday/:calendar_id', verifyToken, get);
};
