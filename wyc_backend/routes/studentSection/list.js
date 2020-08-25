const db = require('../../database');
const StudentSection = db.models.StudentSection;
const Parent = db.models.Parent;
const Student = db.models.Student;
const Section = db.models.Section;
const Class = db.models.Class;
const FeeCategory = db.models.FeeCategory;
const RouteVehicle = db.models.RouteVehicle;
const RouteStop = db.models.RouteStop;
const Route = db.models.Route;
const Vehicle = db.models.Vehicle;
const Stops = db.models.Stops;

function list(req, res, next) {
    const whereCondition = {
        session_id: req.query.session_id
    };

    if (req.query.transport) {
        whereCondition['$student.mode_of_transport$'] = req.query.transport;
    }

    if (req.query.section_id) {
        whereCondition.section_id = req.query.section_id;
        whereCondition.status = 'STUDYING'; 
    }

    if (req.query.status) {
        whereCondition.status = req.query.status;
    }

    StudentSection.findAll({
        include: [{
            required: true,
            model: Student,
            as: 'student',
            include: [{
                required: true,
                model: Parent,
                as: 'parent'
            }, {
                attributes: ['id', 'name'],
                model: FeeCategory,
                as: 'feeCategory'
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
        where: whereCondition,
        order: ['student.first_name', 'student.last_name']
    }).then((results) => {
        res.status(200).json(
            {
                status: true,
                message: 'Section student listed successfully',
                data: results
            });
    }).catch((err) => {
        next(err);
    });
}

module.exports = list;
