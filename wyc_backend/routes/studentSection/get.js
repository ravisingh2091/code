const db = require('../../database');
const StudentSection = db.models.StudentSection;
const Parent = db.models.Parent;
const Student = db.models.Student;
const Section = db.models.Section;
const Class = db.models.Class;
const RouteStop = db.models.RouteStop;
const RouteVehicle = db.models.RouteVehicle;
const Stops = db.models.Stops;
const Vehicle = db.models.Vehicle;
const Route = db.models.Route;

function get(req, res, next) {
    const student_id = req.query.student_id;
    StudentSection.findAll({
        attributes: ['id', 'roll_no', 'student_type', 'status'],
        include: [{
            required: true,
            model: Student,
            as: 'student',
            include: [{
                required: true,
                model: Parent,
                as: 'parent'
            }, {
                attributes: ['id'],
                model: RouteStop,
                as: 'routeStop',
                include: [{
                    attributes: ['id', 'name', 'stu_one_fee', 'stu_both_fee'],
                    model: Stops,
                    as: 'stops',
                }]
            }, {
                attributes: ['id'],
                model: RouteVehicle,
                as: 'routeVehicle',
                include: [{
                    attributes: ['id', 'reg_no', 'name'],
                    model: Vehicle,
                    as: 'vehicle',
                }, {
                    attributes: ['id', 'name'],
                    model: Route,
                    as: 'route',
                }]
            }]
        }, {
            required: true,
            attributes: ['id', 'name'],
            model: Section,
            as: 'section',
            include: [{
                required: true,
                attributes: ['id', 'name'],
                model: Class,
                as: 'class'
            }]
        }],
        where: {
            id: student_id
        }
    }).then((result) => {
        res.status(200).json(
            {
                status: true,
                message: 'Student info get successfully',
                data: result
            });
    }).catch((err) => {
        next(err);
    });
}

module.exports = get;
