const verifyToken = require('../../middleware/verifyToken');
const add = require('./add');
const bulkSender = require('./bulkSender');
const list = require('./list');
const recipient = require('./recipient');


module.exports = (server) => {
    server.post('/v1/message', verifyToken, add);
    server.post('/v1/message/bulk/sender', verifyToken, bulkSender);
    server.get('/v1/message', verifyToken, list);
    server.get('/v1/message/recipient/:msg_id', verifyToken, recipient);
};
