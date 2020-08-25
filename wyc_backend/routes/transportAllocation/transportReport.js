const db = require('../../database');
const StudentSection = db.models.StudentSection;
const Employee = db.models.Employee;
const Student = db.models.Student;
const Class = db.models.Class;
const Section = db.models.Section;
const RouteVehicle = db.models.RouteVehicle;
const RouteStop = db.models.RouteStop;
const Route = db.models.Route;
const Stops = db.models.Stops;
const Vehicle = db.models.Vehicle;
const Parent = db.models.Parent;

function transportReport(req, res, next) {
    if (!req.query.session_id) {
        return res.json({
            status: false,
            message: 'Session is mandatory'
        });
    }

    const vehicleStopJoin = [{
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
            attributes: ['id', 'name'],
            model: Stops,
            as: 'stops'
        }]
    }];

    const stuWhereCondition = {
        session_id: req.query.session_id,
        '$student.mode_of_transport$': 'Bus',
        '$student.status$': 1
    };

    const empWhereCondition = {
        branch_id: req.query.branch_id,
        type_id: 4,
        status: 1,
        mode_of_transport: 'Bus',
    };

    const stuOrderCondition = [];
    const empOrderCondition = [];

    if (req.query.route_id) {
        stuWhereCondition['$student.routeVehicle.route_id$'] = req.query.route_id;
        stuOrderCondition.push('student.routeVehicle.vehicle.name');
        empWhereCondition['$routeVehicle.route_id$'] = req.query.route_id;
        empOrderCondition.push('routeVehicle.vehicle.name');
    }

    if (req.query.stop_id) {
        stuWhereCondition['$student.routeStop.stop_id$'] = req.query.stop_id;
        stuOrderCondition.push('student.routeVehicle.vehicle.name');
        empWhereCondition['$routeStop.stop_id$'] = req.query.stop_id;
        empOrderCondition.push('routeVehicle.vehicle.name');
    }

    if (req.query.vehicle_id) {
        stuWhereCondition['$student.routeVehicle.vehicle_id$'] = req.query.vehicle_id;
        stuOrderCondition.push('student.routeStop.stops.name');
        empWhereCondition['$routeVehicle.vehicle_id$'] = req.query.vehicle_id;
        empOrderCondition.push('routeStop.stops.name');
    }

    if (req.query.route_vehicle_id) {
        stuWhereCondition['$student.route_vehicle_id$'] = req.query.route_vehicle_id;
        stuOrderCondition.push('student.routeStop.stops.name');
        empWhereCondition['route_vehicle_id'] = req.query.route_vehicle_id;
        empOrderCondition.push('routeStop.stops.name');
    }

    if (req.query.route_stop_id) {
        stuWhereCondition['$student.route_stop_id$'] = req.query.route_stop_id;
        stuOrderCondition.push('student.routeVehicle.vehicle.name');
        empWhereCondition['route_stop_id'] = req.query.route_stop_id;
        empOrderCondition.push('routeVehicle.vehicle.name');
    }

    if (req.query.section_id) {
        stuWhereCondition['section_id'] = req.query.section_id;
        stuWhereCondition['$student.route_vehicle_id$'] = {
            $ne: null
        };
        stuWhereCondition['$student.route_stop_id$'] = {
            $ne: null
        };
        stuOrderCondition.push('student.routeVehicle.vehicle.name');
        empWhereCondition['id'] = null;
    }

    Promise.all([
        StudentSection.findAll({
            attributes: ['id', 'roll_no'],
            include: [{
                required: true,
                attributes: ['id', 'name'],
                model: Section,
                as: 'section',
                include: [{
                    required: true,
                    attributes: ['id', 'name'],
                    model: Class,
                    as: 'class',
                }]
            },
            {
                required: true,
                attributes: ['id', 'first_name', 'last_name', 'slot', 'transport_type', 'trans_invoice_till_date', 'trans_payable_amount'],
                model: Student,
                as: 'student',
                include: vehicleStopJoin
            },
             {
                required: true,
                attributes: ['id', 'contact_no', 'last_name', 'slot', 'transport_type', 'trans_invoice_till_date', 'trans_payable_amount'],
                model: Parent,
                as: 'parent',
                include: vehicleStopJoin
            }


            ],
            where: stuWhereCondition,
            order: stuOrderCondition
        }),
        Employee.findAll({
            attributes: ['id', 'first_name', 'last_name', 'contact_no', 'gender', 'slot', 'transport_type'],
            include: vehicleStopJoin,
            where: empWhereCondition,
            order: empOrderCondition
        })
    ]).then(([studentList, employeeList]) => {
        res.json({
            status: true,
            message: 'Studnet & employee listed successfully',
            data: {
                student: studentList,
                employee: employeeList
            }
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = transportReport;
