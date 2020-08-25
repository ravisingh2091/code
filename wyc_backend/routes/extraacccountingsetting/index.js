const verifyToken = require('../../middleware/verifyToken');
const addCollection = require('./addCollection');
const delCollection = require('./delCollection');
const getCollection = require('./getCollection');
const listCollection = require('./listCollection');
const updateCollection = require('./updateCollection');

const addExpenditureHead = require('./addExpenditureHead');
const delExpenditureHead = require('./delExpenditureHead');
const getExpenditureHead = require('./getExpenditureHead');
const listExpenditureHead = require('./listExpenditureHead');
const updateExpenditureHead = require('./updateExpenditureHead');

const addExpenditureSubHead = require('./addExpenditureSubHead');
const delExpenditureSubHead = require('./delExpenditureSubHead');
const getExpenditureSubHead = require('./getExpenditureSubHead');
const listExpenditureSubHead = require('./listExpenditureSubHead');
const updateExpenditureSubHead = require('./updateExpenditureSubHead');

module.exports = (server) => {
    server.post('/v1/collectionHead', verifyToken, addCollection);
    server.delete('/v1/collectionHead', verifyToken, delCollection);
    server.get('/v1/get/collectionHead', verifyToken, getCollection);
    server.get('/v1/collectionHead', verifyToken, listCollection);
    server.put('/v1/collectionHead', verifyToken, updateCollection);

    server.post('/v1/expenditureHead', verifyToken, addExpenditureHead);
    server.delete('/v1/expenditureHead', verifyToken, delExpenditureHead);
    server.get('/v1/get/expenditureHead', verifyToken, getExpenditureHead);
    server.get('/v1/expenditureHead', verifyToken, listExpenditureHead);
    server.put('/v1/expenditureHead', verifyToken, updateExpenditureHead);


    server.post('/v1/expenditureSubHead', verifyToken, addExpenditureSubHead);
    server.delete('/v1/expenditureSubHead', verifyToken, delExpenditureSubHead);
    server.get('/v1/get/expenditureSubHead', verifyToken, getExpenditureSubHead);
    server.get('/v1/expenditureSubHead', verifyToken, listExpenditureSubHead);
    server.put('/v1/expenditureSubHead', verifyToken, updateExpenditureSubHead);
};
