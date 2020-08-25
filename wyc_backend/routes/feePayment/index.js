const verifyToken = require('../../middleware/verifyToken');
const add = require('./add');
const bulkUpdate = require('./bulkUpdate');
const feeHash = require('./feeHash');
const feeReport = require('./feeReport');
const get = require('./get');
const list = require('./list');
const paymentReport = require('./paymentReport');
const studentPayment = require('./studentPayment');

module.exports = (server) => {
    server.post('/v1/fee/payment', verifyToken, add);
    server.put('/v1/fee/bulk/update', verifyToken, bulkUpdate);
    server.post('/v1/fee/payment/hash', feeHash);
    server.get('/v1/fee/report', verifyToken, feeReport);
    server.get('/v1/get/fee/payment', verifyToken, get);
    server.get('/v1/fee/payment', verifyToken, list);
    server.get('/v1/fee/payment/report', verifyToken, paymentReport);
    server.get('/v1/payment/student', verifyToken, studentPayment);
};
