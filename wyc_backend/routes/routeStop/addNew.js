const transport = require('../../common/transport');
const db = require('../../database');
const RouteStop = db.models.RouteStop;

function addNew(req, res, next) {
    const data = req.body;

    RouteStop.findOne({
        where: {
            route_id: data.route_id,
            stop_id: data.stop_id,
        }
    }).then((routeInfo) => {
        if (!routeInfo) {
            return Promise.all([
                transport.updateDropOrder(data.route_id, data.drop_order, 'Add'),
                transport.updatePickOrder(data.route_id, data.pick_order, 'Add')
            ]).then(() => {
                return RouteStop.create({
                    route_id: data.route_id,
                    stop_id: data.stop_id,
                    pick_order: data.pick_order,
                    drop_order: data.drop_order

                }).then(() => {
                    res.json({
                        status: true,
                        message: 'Route stop added successfully'
                    });
                });
            }).catch((err) => {
                next(err);
            });
        }
        res.json({
            status: false,
            message: 'Route already have same stop'
        });
    });
}

module.exports = addNew;
