const verifyToken = require('../../middleware/verifyToken'),
    add = require('./add'),
    deleteStu = require('./deleteStu'),
    profilePhoto = require('./profilePhoto'),
    qrCode = require('./qrCode'),
    transportStatus = require('./transportStatus'),
    update = require('./update'),
    upload = require('./upload');

module.exports = (server) => {
    server.post('/v1/student', verifyToken, add);
    server.delete('/v1/student', verifyToken, deleteStu);
    server.post('/v1/student/profile', verifyToken, profilePhoto);
    server.get('/v1/qrcode/:barcode', verifyToken, qrCode);
    server.put('/v1/student', verifyToken, update);
    server.post('/v1/student/upload', verifyToken, upload);
    server.put('/v1/student/transport/status', verifyToken, transportStatus);
};
