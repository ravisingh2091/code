const db = require('../../database');
const RouteVehicle = db.models.RouteVehicle;
const Vehicle = db.models.Vehicle;
const Route = db.models.Route;
const Driver = db.models.Driver;

function get(req, res, next) {
    let queryData = '';
    if (!req.query.tracking) {
        queryData = {
            include: [{
                required: true,
                attributes: ['id', 'name', 'description'],
                model: Route,
                as: 'route'
            }, {
                required: true,
                attributes: ['id', 'name', 'reg_no'],
                model: Vehicle,
                as: 'vehicle'
            }, {
                model: Driver,
                as: 'driver'
            }, {
                model: Driver,
                as: 'conductor'
            }],
            where: { id: req.query.id }
        };
    } else {
        queryData = {
            attributes: ['id', 'latitude', 'longitude', 'bus_way', 'slot', 'last_stop_id', 'last_stop_time', 'start_time', 'status'],
            where: { id: req.query.id }
        };
    }
    RouteVehicle.findOne(queryData).then((result) => {
        res.json({
            status: true,
            message: 'Route vehicle info get successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = get;
