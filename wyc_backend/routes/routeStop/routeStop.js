const db = require('../../database');
const RouteStop = db.models.RouteStop;
const RouteVehicle = db.models.RouteVehicle;
const Route = db.models.Route;
const Stops = db.models.Stops;
const Vehicle = db.models.Vehicle;

function routeStop(req, res, next) {
    Promise.all([
        RouteStop.findAll({
            attributes: ['id', 'pick_order', 'drop_order'],
            include: [{
                required: true,
                attributes: ['id', 'name', 'description'],
                model: Route,
                as: 'route'
            }, {
                required: true,
                attributes: ['id', 'name', 'latitude', 'longitude'],
                model: Stops,
                as: 'stops'
            }],
            where: { '$route.branch_id$': req.query.branch_id },
            order: ['pick_order']
        }),
        RouteVehicle.findAll({
            attributes: ['id', 'no_of_slot'],
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
            }],
            where: { '$route.branch_id$': req.query.branch_id },
        })
    ]).then(([stopInfo, vehicleInfo]) => {
        if (stopInfo.length) {
            return getResult(stopInfo, vehicleInfo, (result) => {
                res.json({
                    status: true,
                    message: 'Route stops listed successfully',
                    data: result
                });
            });
        }
        res.json({
            status: false,
            message: 'No Stop Found'
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = routeStop;

function getResult(stopInfo, vehicleInfo, callback) {
    const result = [];
    stopInfo.forEach(element => {
        if (!result.some((row) => { return row.route_id === element.route.id; })) {
            result.push({
                route_id: element.route.id,
                route_name: element.route.name,
                stops: [{
                    id: element.id,
                    stop_name: element.stops.name,
                    pick_order: element.pick_order,
                    drop_order: element.drop_order
                }],
                vehicles: [],
            });
        } else {
            const targetRow = result.filter((row) => { return row.route_id === element.route.id; })[0];
            targetRow.stops.push({
                id: element.id,
                stop_name: element.stops.name,
                pick_order: element.pick_order,
                drop_order: element.drop_order
            });
        }
    });

    vehicleInfo.forEach((vehicle) => {
        console.log(JSON.stringify(vehicle));
        if (result.some((row) => { return row.route_id === vehicle.route.id; })) {
            const targetRow = result.filter((row) => { return row.route_id === vehicle.route.id; })[0];
            targetRow.vehicles.push({
                id: vehicle.id,
                name: vehicle.vehicle.name,
                reg_no: vehicle.vehicle.reg_no,
                no_of_slot: vehicle.no_of_slot
            });
        }
    });
    return callback(result);
}
