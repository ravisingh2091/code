const async = require('async');
const db = require('../../database');
const RouteStop = db.models.RouteStop;

function updateOrder(req, res, next) {
    const data = req.body;
    async.eachSeries(data, (element, callback) => {
        RouteStop.update({
            pick_order: element.pick_order,
            drop_order: element.drop_order
        }, { where: { id: element.route_stop_id } }).then(() => callback());
    }, (err) => {
        if (err) {
            next(err);
        }
        res.json({
            status: true,
            message: 'Route stops order updated'
        });
    });
}

module.exports = updateOrder; 
