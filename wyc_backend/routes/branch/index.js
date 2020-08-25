const verifyToken = require('../../middleware/verifyToken');
const add = require('./add');
const dashboard = require('./dashboard');
const get = require('./get');
const list = require('./list');
const search = require('./search');
const transportStatus = require('./transportStatus');
const update = require('./update');
const updateAccount = require('./updateAccount');
const updateStatus = require('./updateStatus');

module.exports = (server) => {
    server.post('/v1/branch', verifyToken, add);
    server.get('/v1/branch/dashboard', verifyToken, dashboard);
    server.get('/v1/branchinfo', verifyToken, get);
    server.get('/v1/branch', verifyToken, list);
    server.get('/v1/search', verifyToken, search);
    server.put('/v1/branch/transport/status', verifyToken, transportStatus);
    server.put('/v1/branch', verifyToken, update);
    server.put('/v1/branch/account', verifyToken, updateAccount);
    server.put('/v1/update/branch/status', verifyToken, updateStatus);
};
