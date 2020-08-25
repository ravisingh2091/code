const verifyToken = require('../../middleware/verifyToken');
const add = require('./add');
const adminNotification = require('./adminNotification');
const del = require('./del');
const list = require('./list');
const parentNotice = require('./parentNotice');
const recipient = require('./recipient');
const update = require('./update');

module.exports = (server) => {
    server.post('/v1/notice', verifyToken, add);
    server.get('/v1/admin/notification', verifyToken, adminNotification);
    server.delete('/v1/notice/:notice_id', verifyToken, del);
    server.get('/v1/notice', verifyToken, list);
    server.get('/v1/notice/parent', verifyToken, parentNotice);
    server.get('/v1/notice/recipient/:notice_id', verifyToken, recipient);
    server.put('/v1/notice', verifyToken, update);
};
