const db = require('../../database');
const StudentSection = db.models.StudentSection;
const Section = db.models.Section;
const Class = db.models.Class;
const Student = db.models.Student;
const Employee = db.models.Employee;
const RouteStop = db.models.RouteStop;
const Stops = db.models.Stops;

function vehicleRouteStudent(req, res, next) {
    const slots = req.query.slots;

    const stuWhereCondition = {
        status: 'STUDYING',
        '$student.route_vehicle_id$': req.query.route_vehicle_id,
        '$student.mode_of_transport$': 'Bus',
        '$student.status$': 1,
        '$student.slot$': {
            $in: slots.split(',')
        }
    };

    const empWhereCondition = {
        route_vehicle_id: req.query.route_vehicle_id,
        mode_of_transport: 'Bus',
        status: 1,
        slot: {
            $in: slots.split(',')
        }
    };

    if (req.query.route_type === 'Pick') {
        stuWhereCondition['$student.transport_type$'] = {
            $in: ['Both', 'Oneway-Pick']
        };
        empWhereCondition['transport_type'] = {
            $in: ['Both', 'Oneway-Pick']
        };
    }

    if (req.query.route_type === 'Drop') {
        stuWhereCondition['$student.transport_type$'] = {
            $in: ['Both', 'Oneway-Drop']
        };
        empWhereCondition['transport_type'] = {
            $in: ['Both', 'Oneway-Drop']
        };
    }

    Promise.all([
        StudentSection.findAll({
            attributes: ['id', 'roll_no'],
            include: [{
                required: true,
                attributes: ['id', 'first_name', 'last_name', 'photo'],
                model: Student,
                as: 'student',
                include: [{
                    required: true,
                    attributes: ['id', 'stop_id', 'pick_order', 'drop_order'],
                    model: RouteStop,
                    as: 'routeStop',
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
                    as: 'class',
                }]
            }],
            where: stuWhereCondition,
        }),
        Employee.findAll({
            attributes: ['id', 'first_name', 'last_name', 'email', 'contact_no', 'photo'],
            include: [{
                required: true,
                attributes: ['id', 'stop_id', 'pick_order', 'drop_order'],
                model: RouteStop,
                as: 'routeStop',
            }],
            where: empWhereCondition
        }),
        RouteStop.findAll({
            include: [{
                required: true,
                attributes: ['id', 'name', 'latitude', 'longitude'],
                model: Stops,
                as: 'stops'
            }],
            where: { route_id: req.query.route_id },
            order: req.query.route_type === 'Pick' ? 'pick_order' : 'drop_order'
        })
    ]).then(([student, employee, stops]) => {
        getFinalResult(student, employee, stops, (result) => {
            res.json({
                status: true,
                message: 'Route stop & students listed successfully',
                data: result
            });
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = vehicleRouteStudent;

function getFinalResult(students, employee, stops, callback) {
    const result = [];
    stops.forEach(element => {
        const stopObj = {};
        stopObj['route_stop_id'] = element.id;
        stopObj['stop_id'] = element.stops.id;
        stopObj['name'] = element.stops.name;
        stopObj['pick_order'] = element.pick_order;
        stopObj['drop_order'] = element.drop_order;
        stopObj['latitude'] = element.stops.latitude;
        stopObj['longitude'] = element.stops.longitude;
        const stuArray = [];
        const empArray = [];
        students.forEach((student) => {
            if (student.student.routeStop.stop_id === element.stops.id) {
                stuArray.push({
                    student_section_id: student.id,
                    student_id: student.student.id,
                    roll_no: student.roll_no,
                    first_name: student.student.first_name,
                    last_name: student.student.last_name,
                    image: student.student.photo,
                    class: student.section.class.name,
                    section: student.section.name
                });
            }
        });
        employee.forEach((empElement) => {
            if (empElement.routeStop.stop_id === element.stops.id) {
                empArray.push({
                    id: empElement.id,
                    first_name: empElement.first_name,
                    last_name: empElement.last_name,
                    email: empElement.email,
                    contact_no: empElement.contact_no,
                    photo: empElement.photo
                });
            }
        });
        stopObj['students'] = stuArray;
        stopObj['employee'] = empArray;
        result.push(stopObj);
    });
    return callback(result);
}
