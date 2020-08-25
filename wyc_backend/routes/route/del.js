const db = require('../../database');
const Route = db.models.Route;
const RouteStop = db.models.RouteStop;
const RouteVehicle = db.models.RouteVehicle;

function del(req, res, next) {
    Promise.all([
        RouteStop.findOne({ where: { route_id: req.query.id } }),
        RouteVehicle.findOne({ where: { route_id: req.query.id } })
    ]).then(([stop, vehicle]) => {
        if (!stop && !vehicle) {
            return Route.destroy({ where: { id: req.query.id } }).then(() => {
                res.json({
                    status:true,
                    message:'Route Deleted successfully'
                });
            });
        }
        res.json({
            status: false,
            message: 'Stops/vehicle assign this route. Kindly unassign and try to delete'
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = del;
