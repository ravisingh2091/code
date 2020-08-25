const db = require('../../database');
const Driver = db.models.Driver;
const RouteVehicle = db.models.RouteVehicle;

function del(req, res, next) {
    const data = {};
    const condition = {};

    if (req.query.emp_type === 'Driver') {
        data.driver_id = null;
        condition.where = {
            driver_id: req.query.id
        };
    }

    if (req.query.emp_type === 'Conductor') {
        data.conductor_id = null;
        condition.where = {
            conductor_id: req.query.id
        };
    }

    RouteVehicle.update(data, condition).then(() => {
        return Driver.destroy({ where: { id: req.query.id } }).then(() => {
            res.json({
                status: true,
                message: req.query.emp_type + ' deleted successfully'
            });
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = del;
