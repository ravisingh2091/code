const async = require('async');
const db = require('../../database');
const StudentSection = db.models.StudentSection;
const Class = db.models.Class;
const Section = db.models.Section;
const Student = db.models.Student;
const Employee = db.models.Employee;
const Vehicle = db.models.Vehicle;
const Route = db.models.Route;
const RouteVehicle = db.models.RouteVehicle;
const RouteStop = db.models.RouteStop;
const Stops = db.models.Stops;
const Parent = db.models.Parent;


function vehicleReport(req, res, next) {
    const vehicle_id = req.query.vehicle_id;

    Promise.all([
        Vehicle.findOne({ where: { id: vehicle_id } }),
        RouteVehicle.findAll({ where: { vehicle_id } }),
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
                '$student.routeVehicle.vehicle_id$': vehicle_id
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
                '$routeVehicle.vehicle_id$': vehicle_id
            },
            order: 'routeStop.pick_order'
        })
    ]).then(([vehicleInfo, routeList, studentList, employeeList]) => {
        if (routeList.length > 0) {
            const routeArray = [];
            return async.eachSeries(routeList, (vehicleRoute, callback) => {
                RouteStop.findAll({
                    attributes: ['id', 'route_id', 'pick_order'],
                    include: [{
                        required: true,
                        attributes: ['id', 'name'],
                        model: Stops,
                        as: 'stops'
                    }, {
                        required: true,
                        attributes: ['id', 'name'],
                        model: Route,
                        as: 'route'
                    }],
                    where: {
                        route_id: vehicleRoute.route_id
                    },
                    order: ['pick_order']
                }).then((stopList) => {
                    routeArray.push({
                        route_id: vehicleRoute.route_id,
                        route_name: stopList[0].route.name,
                        stops: stopList,
                        studentInfo: [],
                        employeeInfo: []
                    });
                    callback();
                });
            }, (err) => {
                if (err) {
                    next(err);
                }
                return getVehicleReport(routeArray, studentList, employeeList, (result) => {
                    return res.json({
                        status: true,
                        message: 'Vehicle report get successfully',
                        data: {
                            name: vehicleInfo.name,
                            regNo: vehicleInfo.reg_no,
                            no_of_seat: vehicleInfo.no_of_seat,
                            routeinfo: result
                        }
                    });
                });
            });
        }
        res.json({
            status: false,
            message: 'Vehicle not allocated to route'
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = vehicleReport;


function getVehicleReport(routeList, studentList, employeeList, callback) {
    // console.log(JSON.stringify(routeList));
    // console.log('------------------------------');
    // console.log(JSON.stringify(studentList));
    // console.log('------------------------------');
    // console.log(JSON.stringify(employeeList));

    studentList.forEach(stuElement => {
        const targetRow = routeList.filter((route) => {
            return route.route_id === stuElement.student.routeVehicle.route.id;
        })[0];
        targetRow.studentInfo.push({
            first_name: stuElement.student.first_name,
            last_name: stuElement.student.last_name,
            class: stuElement.section.class.name,
            Section: stuElement.section.name,
            enable_date: stuElement.student.trans_enable_date,
            contact_no: stuElement.student.parent.contact_no,
            payable_amount: stuElement.student.trans_payable_amount,
            transport_type: stuElement.student.transport_type,
            slot: stuElement.student.slot,
            monthlyfee: stuElement.student.transport_type === 'Both' ?
                stuElement.student.routeStop.stops.stu_both_fee : stuElement.student.routeStop.stops.stu_one_fee,
            stop_name: stuElement.student.routeStop.stops.name
        });
    });

    employeeList.forEach((empElement) => {
        const targetRow = routeList.filter((route) => {
            return route.route_id === empElement.routeVehicle.route.id;
        })[0];
        targetRow.employeeInfo.push({
            first_name: empElement.first_name,
            last_name: empElement.last_name,
            contact_no: empElement.contact_no,
            stop_name: empElement.routeStop.stops.name
        });
    });

    return callback(routeList);
}
