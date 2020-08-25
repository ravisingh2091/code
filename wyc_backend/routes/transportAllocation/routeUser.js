const db = require('../../database');
const Student = db.models.Student;
const Employee = db.models.Employee;
const RouteStop = db.models.RouteStop;

function routeUser(req, res, next) {
    Promise.all([
        Student.findAll({
            attributes: ['id', 'first_name', 'last_name'],
            include: [{
                required: true,
                attributes: ['id', 'name'],
                model: RouteStop,
                as: 'routeStop'
            }],
            where: {
                status: 1,
                '$routeStop.route_id$': req.query.route_id
            },order: ['student.first_name', 'student.last_name']
        }),
        Employee.findAll({
            attributes: ['id', 'first_name', 'last_name'],
            include: [{
                required: true,
                attributes: ['id', 'name'],
                model: RouteStop,
                as: 'routeStop'
            }],
            where: {
                status: 1,
                '$routeStop.route_id$': req.query.route_id
            }
        })
    ]).then(([stuList, empList]) => {
        res.json({
            status: true,
            message: 'Route user listed successfully',
            data: {
                student: stuList,
                employee: empList
            }
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = routeUser;
