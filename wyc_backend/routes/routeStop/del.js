const transport = require('../../common/transport');
const db = require('../../database');
const RouteStop = db.models.RouteStop;
const Student = db.models.Student;
const Employee = db.models.Employee;

function del(req, res, next) {
    Promise.all([
        Student.findOne({
            attributes: ['id'], 
            where: {
                route_stop_id: req.query.id,
                mode_of_transport: 'Bus'
            }
        }),
        Employee.findOne({
            attributes: ['id'], 
            where: {
                route_stop_id: req.query.id,
                mode_of_transport: 'Bus'
            }
        })
    ]).then(([studentExist, employeeExist]) => {
        if (!studentExist && !employeeExist) {
            return RouteStop.findOne({
                attributes: ['id', 'route_id', 'pick_order', 'drop_order'],
                where: { id: req.query.id }
            }).then((stopInfo) => {
                if (stopInfo) {
                    return Promise.all([
                        transport.updateDropOrder(stopInfo.route_id, stopInfo.drop_order, 'Delete'),
                        transport.updatePickOrder(stopInfo.route_id, stopInfo.pick_order, 'Delete')
                    ]).then(() => {
                        return RouteStop.destroy({ where: { id: req.query.id } }).then(() => {
                            res.json({
                                status: true,
                                message: 'Route Stop deleted successfully'
                            });
                        });
                    });
                }
                return res.json({
                    status: true,
                    message: 'Route Stop deleted successfully'
                });
            });
        }
        return res.json({
            status: false,
            message: 'Stop assigned to student or employee. Kindly unassign and delete'
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = del;
