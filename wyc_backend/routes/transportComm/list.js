const db = require('../../database');
const TransportComm = db.models.TransportComm;
const RouteVehicle = db.models.RouteVehicle;
const Vehicle = db.models.Vehicle;
const Route = db.models.Route;
const Stops = db.models.Stops;

function list(req, res, next) {
    const whereCondition = {
        session_id: req.query.session_id
    };

    if (req.query.msg_type) {
        whereCondition.msg_type = req.query.msg_type;
    }

    if (req.stop_id) {
        whereCondition.stop_id = req.query.stop_id;
    }

    if (req.route_vehicle_id) {
        whereCondition.route_vehicle_id = req.query.route_vehicle_id;
    }

    TransportComm.findAll({
        include: [{
            attributes: ['id'],
            model: RouteVehicle,
            as: 'routeVehicle',
            include: [{
                attributes: ['id', 'reg_no', 'name'],
                model: Vehicle,
                as: 'vehicle'
            }, {
                attributes: ['id', 'name'],
                model: Route,
                as: 'route'
            }]
        }, {
            attributes: ['id', 'name'],
            model: Stops,
            as: 'stops',
        }],
        where: whereCondition
    }).then((result) => {
        res.json({
            status: true,
            message: 'Transport communication listed Successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = list;
