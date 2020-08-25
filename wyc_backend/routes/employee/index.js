const verifyToken = require('../../middleware/verifyToken'),
    add = require('./add'),
    deactive = require('./deactive'),
    get = require('./get'),
    list = require('./list'),
    profileImage = require('./profileImage'),
    transportStatus = require('./transportStatus'),
    update = require('./update'),
    upload = require('./upload');

module.exports = (server) => {
    server.post('/v1/employee', verifyToken, add);
    server.put('/v1/employee/deactive', verifyToken, deactive);
    server.get('/v1/employee/:id', verifyToken, get);
    server.get('/v1/employee', verifyToken, list);
    server.post('/v1/employee/profile', verifyToken, profileImage);
    server.put('/v1/employee/transport/status', verifyToken, transportStatus);
    server.put('/v1/employee', verifyToken, update);
    server.post('/v1/employee/upload', verifyToken, upload);
};
