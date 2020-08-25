const verifyToken = require('../../middleware/verifyToken'),
    addInvoice = require('./addInvoice'),
    invoiceInfo = require('./invoiceInfo'),
    list = require('./list'),
    getStudentInvoice = require('./getStudentInvoice'),
    invoiceGenerate = require('./invoiceGenerate'),
    studentInvoiceList = require('./studentInvoiceList');

module.exports = (server) => {
    server.post('/v1/invoice', verifyToken, addInvoice);
    server.get('/v1/invoice/info', verifyToken, invoiceInfo);
    server.get('/v1/invoice/list', verifyToken, list);
    server.get('/v1/invoice/student', verifyToken, getStudentInvoice);
    server.get('/v1/invoice/generate', verifyToken, invoiceGenerate);
    server.get('/v1/invoice/student/list', verifyToken, studentInvoiceList);
};
