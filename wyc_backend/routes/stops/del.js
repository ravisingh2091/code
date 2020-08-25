const db = require('../../database');
const Stops = db.models.Stops;
const RouteStop = db.models.RouteStop;

function del(req, res, next) {
    RouteStop.findOne({ where: { stop_id: req.query.id } }).then((stopInfo) => {
        if (!stopInfo) {
            return Stops.destroy({
                where: { id: req.query.id }
            }).then(() => {
                res.json({
                    status: true,
                    message: 'Stop deleted successfully'
                });
            });
        }
        res.json({
            status: false,
            message: 'Stop allocated to route'
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = del;
