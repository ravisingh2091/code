const verifyToken = require('../../middleware/verifyToken');
const addCollectionPayment = require('./addCollectionPayment');
const delCollectionPayment = require('./delCollectionPayment');
const getCollectionPayment = require('./getCollectionPayment');
const listCollectionPayment = require('./listCollectionPayment');
const updateCollectionPayment = require('./updateCollectionPayment');
const reportCollectionPayment = require('./reportCollectionPayment');
module.exports = (server) => {
    server.post('/v1/collectionPayment', verifyToken, addCollectionPayment);
    server.delete('/v1/collectionPayment', verifyToken, delCollectionPayment);
    server.get('/v1/get/collectionPayment', verifyToken, getCollectionPayment);
    server.get('/v1/collectionPayment', verifyToken, listCollectionPayment);
    server.put('/v1/collectionPayment', verifyToken, updateCollectionPayment);
    server.post('/v1/report/collectionPayment', verifyToken, reportCollectionPayment);
};
