const verifyToken = require('../../middleware/verifyToken');
const add = require('./add');
const addNew = require('./addNew');
const del = require('./del');
const list = require('./list');
const routeStop = require('./routeStop');
const stopRoute = require('./stopRoute');
const updateOrder = require('./updateOrder');

module.exports = (server) => {
    server.post('/v1/route/stop', verifyToken, add);
    server.post('/v1/new/route/stop/', verifyToken, addNew);
    server.delete('/v1/route/stop', verifyToken, del);
    server.get('/v1/route/stop/list', verifyToken, list);
    server.get('/v1/route/stop', verifyToken, routeStop);
    server.get('/v1/stop/routes', verifyToken, stopRoute);
    server.put('/v1/stop/order/update', verifyToken, updateOrder);
};
