const db = require('../../database');
const RouteVehicle = db.models.RouteVehicle;

function add(req, res, next) {
    const data = req.body;
    RouteVehicle.create({
        route_id: data.route_id,
        vehicle_id: data.vehicle_id,
        driver_id: data.driver_id,
        conductor_id: data.conductor_id,
        no_of_slot: data.no_of_slot
    }).then(() => {
        res.json({
            status: true,
            message: 'Route vehicle allocated successfully'
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = add;
