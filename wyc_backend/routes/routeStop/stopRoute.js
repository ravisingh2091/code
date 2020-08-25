const db = require('../../database');
const RouteStop = db.models.RouteStop;
const Route = db.models.Route;
const Stops = db.models.Stops;

function routeStop(req, res, next) {
    RouteStop.findAll({
        attributes: ['id'],
        include: [{
            required: true,
            attributes: ['id', 'name'],
            model: Route,
            as: 'route'
        }, {
            required: true,
            attributes: ['id', 'name'],
            model: Stops,
            as: 'stops'
        }],
        where: { '$route.branch_id$': req.query.branch_id },
        order: 'stops.name, route.name'
    }).then((stopRouteInfo) => {
        if (stopRouteInfo.length) {
            return getResult(stopRouteInfo, (result) => {
                res.json({
                    status: true,
                    message: 'Stops route listed successfully',
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

function getResult(routeStopInfo, callback) {
    const result = [];
    routeStopInfo.forEach(element => {
        if (!result.some((row) => { return row.stop_id === element.stops.id; })) {
            result.push({
                stop_id: element.stops.id,
                stop_name: element.stops.name,
                routes: [{
                    route_id: element.route.id,
                    route_name: element.route.name
                }]
            });
        } else {
            const targetRow = result.filter((row) => { return row.stop_id === element.stops.id; })[0];
            targetRow.routes.push({
                route_id: element.route.id,
                route_name: element.route.name
            });
        }
    });

    return callback(result);
}
