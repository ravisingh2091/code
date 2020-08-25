const verifyToken = require('../../middleware/verifyToken');
const add = require('./add');
const bulkUpdate = require('./bulkUpdate');
const feeReport = require('./feeReport');
const get = require('./get');
const list = require('./list');
const paymentReport = require('./paymentReport');
const studentPaymentList = require('./studentPaymentList');

module.exports = (server) => {
    server.post('/v1/transport/payment', verifyToken, add);
    server.put('/v1/transport/bulk/fee', verifyToken, bulkUpdate);
    server.get('/v1/transport/fee/report', verifyToken, feeReport);
    server.get('/v1/get/transport/payment', verifyToken, get);
    server.get('/v1/transport/payment', verifyToken, list);
    server.get('/v1/trans/payment/report', verifyToken, paymentReport);
    server.get('/v1/trans/payment/student/list', verifyToken, studentPaymentList);
};
