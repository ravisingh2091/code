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

function routeReport(req, res, next) {
    const route_id = req.query.route_id;

    Promise.all([
        Route.findOne({ attributes: ['id', 'name'], where: { id: route_id } }),
        RouteStop.findAll({
            attributes: ['id'],
            include: [{
                required: true,
                attributes: ['id', 'name', 'stu_one_fee', 'stu_both_fee'],
                model: Stops,
                as: 'stops'
            }],
            where: {
                route_id
            },
            order: ['pick_order']
        }),
        RouteVehicle.findAll({
            attributes: ['id', 'no_of_slot'],
            include: [{
                required: true,
                attributes: ['id', 'name', 'reg_no', 'no_of_seat'],
                model: Vehicle,
                as: 'vehicle'
            }],
            where: {
                route_id
            }
        }),
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
                attributes: ['id', 'first_name', 'last_name', 'slot', 'transport_type', 'trans_enable_date', 'trans_invoice_till_date', 'trans_payable_amount'],
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
                    attributes: ['id', 'pick_order'],
                    model: RouteStop,
                    as: 'routeStop',
                    include: [{
                        required: true,
                        attributes: ['id', 'name', 'stu_one_fee', 'stu_both_fee'],
                        model: Stops,
                        as: 'stops'
                    }]

                 

                },
                   { required: true,
                    attributes: ['id', 'contact_no'],
                    model: Parent,
                    as: 'parent'
                  

                 

                }
                ]
            }],
            where: {
                session_id: req.query.session_id,
                '$student.mode_of_transport$': 'Bus',
                '$student.status$': 1,
                '$student.routeVehicle.route_id$': route_id
            }, order: ['student.first_name', 'student.last_name']
        }),
        Employee.findAll({
            attributes: ['id', 'first_name', 'last_name', 'contact_no', 'gender', 'slot', 'transport_type'],
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
                attributes: ['id', 'pick_order'],
                model: RouteStop,
                as: 'routeStop',
                include: [{
                    required: true,
                    attributes: ['id', 'name'],
                    model: Stops,
                    as: 'stops'
                }]
            }],
            where: {
                branch_id: req.query.branch_id,
                type_id: 4,
                status: 1,
                mode_of_transport: 'Bus',
                '$routeVehicle.route_id$': route_id
            },
            order: 'routeStop.pick_order'
        })
    ]).then(([routeInfo, stopList, vehicleList, studentList, employeeList]) => {
        if (stopList.length > 0) {
            return getBusStudentList(vehicleList, studentList, employeeList, (result) => {
                return res.json({
                    status: true,
                    message: 'Route report get successfully',
                    data: {
                        routeInfo,
                        no_of_bus_stops: stopList,
                        no_of_buses: result
                    }
                });
            });
        }
        res.json({
            status: false,
            message: 'No stop found'
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = routeReport;

function getBusStudentList(vehicleList, studentList, employeeList, callback) {
    // console.log(JSON.stringify(vehicleList));
    // console.log('------------------------------');
    // console.log(JSON.stringify(studentList));
    // console.log('------------------------------');
    // console.log(JSON.stringify(employeeList));

    const finalArray = [];
    vehicleList.forEach(element => {
        const studentArray = [];
        const employeeArray = [];
        const myObj = {};

        myObj['route_vehicle_id'] = element.id;
        myObj['vehicle_name'] = element.vehicle.name;
        myObj['no_of_seat'] = element.vehicle.no_of_seat;
        myObj['reg_no'] = element.vehicle.reg_no;
        studentList.forEach((stuElement) => {
            if (stuElement.student.routeVehicle.id === element.id) {
                studentArray.push({
                    first_name: stuElement.student.first_name,
                    last_name: stuElement.student.last_name,
                    class: stuElement.section.class.name,
                    contact_no: stuElement.student.parent.contact_no,
                    Section: stuElement.section.name,
                    enable_date: stuElement.student.trans_enable_date,
                    payable_amount: stuElement.student.trans_payable_amount,
                    transport_type: stuElement.student.transport_type,
                    slot: stuElement.student.slot,
                    monthlyfee: stuElement.student.transport_type === 'Both' ?
                    stuElement.student.routeStop.stops.stu_both_fee : stuElement.student.routeStop.stops.stu_one_fee,
                    stop_name: stuElement.student.routeStop.stops.name
                });
            }
        });
        employeeList.forEach(empElement => {
            if (empElement.routeVehicle.id === element.id) {
                employeeArray.push({
                    first_name: empElement.first_name,
                    last_name: empElement.last_name,
                    contact_no: empElement.contact_no,
                    stop_name: empElement.routeStop.stops.name
                });
            }
        });
        myObj['no_of_studentInfo'] = studentArray;
        myObj['no_of_employeeInfo'] = employeeArray;
        finalArray.push(myObj);
    });
    return callback(finalArray);
}
