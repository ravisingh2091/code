const verifyToken = require('../../middleware/verifyToken');
const addExpenditurePayment = require('./addExpenditurePayment');
const delExpenditurePayment = require('./delExpenditurePayment');
const getExpenditurePayment = require('./getExpenditurePayment');
const listExpenditurePayment = require('./listExpenditurePayment');
const updateExpenditurePayment = require('./updateExpenditurePayment');
const reportExpenditurePayment = require('./reportExpenditurePayment');
module.exports = (server) => {
    server.post('/v1/expenditurePayment', verifyToken, addExpenditurePayment);
    server.delete('/v1/expenditurePayment', verifyToken, delExpenditurePayment);
    server.get('/v1/get/expenditurePayment', verifyToken, getExpenditurePayment);
    server.get('/v1/expenditurePayment', verifyToken, listExpenditurePayment);
    server.put('/v1/expenditurePayment', verifyToken, updateExpenditurePayment);
    server.post('/v1/report/expenditurePayment', verifyToken, reportExpenditurePayment);
};
