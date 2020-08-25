const verifyToken = require('../../middleware/verifyToken'),
    add = require('./add'),
    del = require('./del'),
    list = require('./list'),
    update = require('./update');

module.exports = (server) => {
    server.post('/v1/supplementary/exam', verifyToken, add);
    server.delete('/v1/supplementary/exam', verifyToken, del);
    server.get('/v1/supplementary/exam', verifyToken, list);
    server.put('/v1/supplementary/exam', verifyToken, update);
};
