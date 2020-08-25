const async = require('async');
const db = require('../../database');
const RouteStop = db.models.RouteStop;

function add(req, res, next) {
    async.eachSeries(req.body.stops, (stopInfo, callback) => {
        RouteStop.findOrCreate({
            defaults: {
                route_id: req.body.route_id,
                stop_id: stopInfo.stop_id,
                pick_order: stopInfo.pick_order,
                drop_order: stopInfo.drop_order
            }, where: {
                route_id: req.body.route_id,
                stop_id: stopInfo.stop_id,
            }
        }).then(() => {
            return callback();
        });
    }, (err) => {
        if (err) {
            next(err);
        }
        res.json({
            status: true,
            message: 'Route stops added successfully'
        });
    });
}

module.exports = add;
