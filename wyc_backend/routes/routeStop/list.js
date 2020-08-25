const db = require('../../database');
const RouteStop = db.models.RouteStop;
const Stops = db.models.Stops;
const Route = db.models.Route;

function list(req, res, next) {
    Promise.all([
        Route.findOne({ where: { id: req.query.route_id } }),
        RouteStop.findAll({
            include: [{
                required: true,
                attributes: ['id', 'name', 'description'],
                model: Stops,
                as: 'stops'
            }],
            where: { route_id: req.query.route_id },
            order: 'pick_order'
        })
    ]).then(([routeInfo, stopInfo]) => {
        res.json({
            status: true,
            message: 'Route stop listed successfully',
            data: {
                routeInfo,
                stopInfo
            }
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = list;
