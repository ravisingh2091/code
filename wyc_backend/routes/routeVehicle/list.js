const db = require('../../database');
const RouteVehicle = db.models.RouteVehicle;
const Route = db.models.Route;
const Vehicle = db.models.Vehicle;
const Driver = db.models.Driver;

function list(req, res, next) {
    const whereCondition = {
        '$route.branch_id$': req.query.branch_id
    };

    if (req.query.route_id) {
        whereCondition.route_id = req.query.route_id;
    }
    RouteVehicle.findAll({
        attributes: ['id', 'no_of_slot', 'latitude', 'longitude', 'bus_way', 'slot', 'last_stop_id', 'last_stop_time', 'start_time', 'status'],
        include: [{
            required: true,
            attributes: ['id', 'name', 'description'],
            model: Route,
            as: 'route',
        }, {
            required: true,
            attributes: ['id', 'name', 'reg_no'],
            model: Vehicle,
            as: 'vehicle',
        }, {
            attributes: ['id', 'first_name', 'last_name', 'mobile_no'],
            model: Driver,
            as: 'driver',
        }, {
            attributes: ['id', 'first_name', 'last_name', 'mobile_no'],
            model: Driver,
            as: 'conductor',
        }],
        where: whereCondition
    }).then((result) => {
        res.json({
            status: true,
            message: 'Vehicle allocation listed successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = list;
