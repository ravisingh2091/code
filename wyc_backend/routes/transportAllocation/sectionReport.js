const db = require('../../database');
const StudentSection = db.models.StudentSection;
const Student = db.models.Student;
const Class = db.models.Class;
const Section = db.models.Section;
const RouteVehicle = db.models.RouteVehicle;
const RouteStop = db.models.RouteStop;
const Route = db.models.Route;
const Stops = db.models.Stops;
const Vehicle = db.models.Vehicle;
const Parent = db.models.Parent;

function sectionReport(req, res, next) {
    Promise.all([
        Section.findOne({
            attributes: ['id', 'name'],
            include: [{
                required: true,
                attributes: ['id', 'name'],
                model: Class,
                as: 'class',
            }],
            where: { id: req.query.section_id }
        }),
        StudentSection.findAll({
            attributes: ['id', 'roll_no'],
            include: [{
                required: true,
                attributes: ['id', 'first_name', 'last_name', 'slot', 'transport_type', 'trans_invoice_till_date', 'trans_enable_date', 'trans_payable_amount'],
                model: Student,
                as: 'student',
                include: [{
                    required: true,
                    attributes: ['id', 'vehicle_id'],
                    model: RouteVehicle,
                    as: 'routeVehicle',
                    include: [{
                        required: true,
                        attributes: ['id', 'name', 'reg_no'],
                        model: Vehicle,
                        as: 'vehicle'
                    }, {
                        required: true,
                        attributes: ['id', 'name'],
                        model: Route,
                        as: 'route'
                    }]
                }, {
                    required: true,
                    attributes: ['id'],
                    model: RouteStop,
                    as: 'routeStop',
                    include: [{
                        required: true,
                        attributes: ['id', 'name','stu_one_fee', 'stu_both_fee'],
                        model: Stops,
                        as: 'stops'
                    }]
                },{ required: true,
                    attributes: ['id', 'contact_no'],
                    model: Parent,
                    as: 'parent'
                  

                 

                }]
            }],
            where: {
                session_id: req.query.session_id,
                section_id: req.query.section_id,
                '$student.mode_of_transport$': 'Bus',
                '$student.status$': 1,
                '$student.route_vehicle_id$': {
                    $ne: null
                },
                '$student.route_stop_id$': {
                    $ne: null
                }
            },
            order: ['student.first_name', 'student.last_name']
        })
    ]).then(([sectionInfo, studentInfo]) => {
        res.json({
            status: true,
            message: 'Student transport report get successfully',
            data: {
                sectionInfo,
                studentInfo
            }
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = sectionReport;
