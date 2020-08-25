const verifyToken = require('../../middleware/verifyToken');
const add = require('./add');
const addFeeConfigure = require('./addFeeConfigure');
const get = require('./get');
const getConfigureHead = require('./getConfigureHead');
const getConfigureSchedule = require('./getConfigureSchedule');
const list = require('./list');
const listFeeConfigure = require('./listFeeConfigure');
const studentSchedule = require('./studentSchedule');
const update = require('./update');

module.exports = (server) => {
    server.post('/v1/fee/structure', verifyToken, add);
    server.get('/v1/get/fee/structure', verifyToken, get);
    server.get('/v1/fee/structure', verifyToken, list);
    server.put('/v1/fee/structure', verifyToken, update);

    server.post('/v1/fee/configure', verifyToken, addFeeConfigure);
    server.get('/v1/configure/head', verifyToken, getConfigureHead);
    server.get('/v1/configure/schedule', verifyToken, getConfigureSchedule);
    server.get('/v1/fee/configure', verifyToken, listFeeConfigure);
    server.get('/v1/schedule/student', verifyToken, studentSchedule);
};
