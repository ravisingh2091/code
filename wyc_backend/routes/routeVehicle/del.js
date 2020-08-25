const db = require('../../database');
const RouteVehicle = db.models.RouteVehicle;
const TransportComm = db.models.TransportComm;
const Student = db.models.Student;
const Employee = db.models.Employee;

function del(req, res, next) {
    Promise.all([
        Student.findOne({ attributes: ['id'], where: { route_vehicle_id: req.query.id } }),
        Employee.findOne({ attributes: ['id'], where: { route_vehicle_id: req.query.id } })
    ]).then(([studentExist, employeeExist]) => {
        if (!studentExist && !employeeExist) {
            return TransportComm.destroy({ where: { route_vehicle_id: req.query.id } }).then(() => {
                return RouteVehicle.destroy({ where: { id: req.query.id } }).then(() => {
                    res.json({
                        status: true,
                        message: 'Route vehicle deleted successfully'
                    });
                });
            });
        }
        res.json({
            status: false,
            message: 'Vehicle assigned to student or employee. Kindly unassign and delete'
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = del;
