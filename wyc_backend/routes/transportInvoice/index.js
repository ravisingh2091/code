const verifyToken = require('../../middleware/verifyToken');
const add = require('./add');
const generate = require('./generate');
const get = require('./get');
const getTransStuInvoice = require('./getTransStuInvoice');
const list = require('./list');
const studentInvoiceList = require('./studentInvoiceList');

module.exports = (server) => {
    server.post('/v1/trans/invoice', verifyToken, add);
    server.get('/v1/trans/invoice/generate', verifyToken, generate);
    server.get('/v1/get/trans/invoice', verifyToken, get);
    server.get('/v1/trans/student/invoice', verifyToken, getTransStuInvoice);
    server.get('/v1/trans/invoice', verifyToken, list);
    server.get('/v1/trans/student/invoice/list', verifyToken, studentInvoiceList);
};
