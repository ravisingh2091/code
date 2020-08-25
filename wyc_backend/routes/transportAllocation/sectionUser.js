const db = require('../../database');
const StudentSection = db.models.StudentSection;
const Student = db.models.Student;
const RouteStop = db.models.RouteStop;
const Route = db.models.Route;

function sectionUser(req, res, next) {
    StudentSection.findAll({
        attributes: ['id', 'roll_no'],
        include: [{
            required: true,
            attributes: ['id', 'first_name', 'last_name'],
            model: Student,
            as: 'student',
            include: [{
                required: true,
                attributes: ['id', 'pick_order', 'drop_order'],
                model: RouteStop,
                as: 'routeStop',
                include: [{
                    required: true,
                    attributes: ['id', 'name', 'description'],
                    model: Route,
                    as: 'route',
                }]
            }]
        }],
        where: {
            session_id: req.query.session_id,
            section_id: req.query.section_id
        },
        order: '`student.routeStop.route.id`, `student.routeStop.pick_order`'
    }).then((result) => {
        res.json({
            status: true,
            message: 'Section student stop & route info listed successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = sectionUser;
