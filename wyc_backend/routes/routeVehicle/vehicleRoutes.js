const db = require('../../database');
const RouteVehicle = db.models.RouteVehicle;
const Route = db.models.Route;
const Driver = db.models.Driver;

function vehicleRoutes(req, res, next) {
    RouteVehicle.findAll({
        attributes: ['id', 'no_of_slot'],
        include: [{
            required: true,
            attributes: ['id', 'name'],
            model: Route,
            as: 'route'
        }, {
            attributes: ['id', 'first_name', 'last_name', 'mobile_no', 'email', 'imei'],
            model: Driver,
            as: 'driver'
        }, {
            attributes: ['id', 'first_name', 'last_name', 'mobile_no', 'email'],
            model: Driver,
            as: 'conductor'
        }],
        where: {
            vehicle_id: req.query.vehicle_id
        }
    }).then((data) => {
        res.json({
            status: true,
            message: 'Vehicle routes listed successfully',
            data
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = vehicleRoutes;
