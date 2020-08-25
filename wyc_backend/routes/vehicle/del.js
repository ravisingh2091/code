const db = require('../../database');
const Vehicle = db.models.Vehicle;
const FuelConsumption = db.models.FuelConsumption;
const RouteVehicle = db.models.RouteVehicle;

function del(req, res, next) {
    RouteVehicle.findOne({ where: { vehicle_id: req.query.id } }).then((routeVehicleInfo) => {
        if (!routeVehicleInfo) {
            return Promise.all([
                Vehicle.destroy({ where: { id: req.query.id } }),
                FuelConsumption.destroy({ where: { vehicle_id: req.query.id } })
            ]).then(() => {
                res.json({
                    status: true,
                    message: 'Vehicle deleted successfully'
                });
            });
        }
        res.json({
            status: false,
            message: 'Vehicle allocated to some route'
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = del;
