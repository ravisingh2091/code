const db = require('../../database');
const RouteVehicle = db.models.RouteVehicle;

function update(req, res, next) {
    const data = req.body;
    RouteVehicle.update({
        route_id: data.route_id,
        vehicle_id: data.vehicle_id,
        driver_id: data.driver_id,
        conductor_id: data.conductor_id,
        no_of_slot: data.no_of_slot
    }, { where: { id: data.id } }).then(() => {
        res.json({
            status: true,
            message: 'Route vehicle info updated successfully'
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = update;
