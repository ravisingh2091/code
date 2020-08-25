const verifyToken = require('../../middleware/verifyToken');
const add = require('./add');
const del = require('./del');
const get = require('./get');
const list = require('./list');
const update = require('./update');

const vehicleRoutes = require('./vehicleRoutes');
const vehicleRouteStatus = require('./vehicleRouteStatus');
const vehicleRouteUser = require('./vehicleRouteUser');

module.exports = (server) => {
    server.post('/v1/route/vehicle', verifyToken, add);
    server.delete('/v1/route/vehicle', verifyToken, del);
    server.get('/v1/get/route/vehicle', get);
    server.get('/v1/route/vehicle', verifyToken, list);
    server.put('/v1/route/vehicle', verifyToken, update);

    server.get('/v1/vehicle/routes', vehicleRoutes);
    server.put('/v1/vehicle/route/status', vehicleRouteStatus);
    server.get('/v1/vehicle/route/user', vehicleRouteUser);
};
