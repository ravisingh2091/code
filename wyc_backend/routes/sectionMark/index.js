const verifyToken = require('../../middleware/verifyToken');
const list = require('./list');
const publish = require('./publish');
const reportCard = require('./reportCard');

module.exports = (server) => {
    server.get('/v1/section/mark', verifyToken, list);
    server.post('/v1/section/result/publish', verifyToken, publish);
    server.get('/v1/report/card', reportCard);
};
