const async = require('async');
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

function stopReport(req, res, next) {
    const stop_id = req.query.stop_id;

    Promise.all([
        Stops.findOne({
            attributes: ['id', 'name', 'stu_one_fee', 'stu_both_fee'],
            where: { id: stop_id }
        }),
        RouteStop.findAll({
            attributes: ['id', 'route_id'],
            include: [{
                required: true,
                attributes: [],
                model: Stops,
                as: 'stops'
            }],
            where: {
                '$stops.id$': stop_id
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
            }, {
                required: true,
                attributes: ['id', 'first_name', 'last_name', 'slot', 'transport_type', 'trans_enable_date', 'trans_invoice_till_date', 'trans_payable_amount', 'route_vehicle_id'],
                model: Student,
                as: 'student',
                include: [{
                    required: true,
                    attributes: [],
                    model: RouteStop,
                    as: 'routeStop'
                },

                     {
                    required: true,
                    attributes: ['id','contact_no'],
                    model: Parent,
                    as: 'parent'
                }

                ]



            }],
            where: {
                session_id: req.query.session_id,
                '$student.mode_of_transport$': 'Bus',
                '$student.status$': 1,
                '$student.routeStop.stop_id$': stop_id
            },order: ['student.first_name', 'student.last_name']
        }),
        Employee.findAll({
            attributes: ['id', 'first_name', 'last_name', 'contact_no', 'gender', 'slot', 'transport_type', 'route_vehicle_id'],
            include: [{
                required: true,
                attributes: ['id'],
                model: RouteStop,
                as: 'routeStop'
            }],
            where: {
                branch_id: req.query.branch_id,
                type_id: 4,
                status: 1,
                mode_of_transport: 'Bus',
                '$routeStop.stop_id$': stop_id
            }
        })
    ]).then(([stopInfo, stopRoutes, studentList, employeeList]) => {
        // console.log(JSON.stringify(stopInfo));
        // console.log('----------');
        // console.log(JSON.stringify(stopRoutes));
        // console.log('---------');

        if (stopRoutes.length > 0) {
            const routeVehicleArray = [];
            return async.eachSeries(stopRoutes, (stopRoute, callback) => {
                RouteVehicle.findAll({
                    attributes: ['id'],
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
                    }],
                    where: { route_id: stopRoute.route_id }
                }).then((routeVehicleList) => {
                    if (routeVehicleList.length > 0) {
                        async.eachSeries(routeVehicleList, (routeVehicleEle, cb) => {
                            routeVehicleArray.push({
                                route_vehicle_id: routeVehicleEle.id,
                                route_name: routeVehicleEle.route.name,
                                vehicle_name: routeVehicleEle.vehicle.name,
                                vehicle_reg_no: routeVehicleEle.vehicle.reg_no,
                                studentInfo: [],
                                employeeInfo: []
                            });
                            cb();
                        }, (err) => {
                            if (err) {
                                next(err);
                            }
                            callback();
                        });
                    } else {
                        callback();
                    }
                });
            }, (err) => {
                if (err) {
                    next(err);
                }
                return getStopReport(routeVehicleArray, studentList, employeeList, (result) => {
                    return res.json({
                        status: true,
                        message: 'Stop report get successfully',
                        data: {
                            stop_name: stopInfo.name,
                            stu_one_fee: stopInfo.stu_one_fee,
                            stu_both_fee: stopInfo.stu_both_fee,
                            stopInfo: result
                        }
                    });
                });
            });
        }
        res.json({
            status: false,
            message: 'Stop not allocated to route'
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = stopReport;

function getStopReport(routeVehicleList, studentList, employeeList, callback) {
    // console.log(JSON.stringify(routeVehicleList));
    // console.log('------------------------------');
    // console.log(JSON.stringify(studentList));
    // console.log('------------------------------');
    // console.log(JSON.stringify(employeeList));

    studentList.forEach(stuElement => {
        const targetRow = routeVehicleList.filter((routeVehicle) => {
            return routeVehicle.route_vehicle_id === stuElement.student.route_vehicle_id;
        })[0];
        if (targetRow) {
            targetRow.studentInfo.push({
                first_name: stuElement.student.first_name,
                last_name: stuElement.student.last_name,
                class: stuElement.section.class.name,
                contact_no: stuElement.student.parent.contact_no,
                Section: stuElement.section.name,
                enable_date: stuElement.student.trans_enable_date,
                payable_amount: stuElement.student.trans_payable_amount,
                transport_type: stuElement.student.transport_type,
                slot: stuElement.student.slot
            });
        }
    });

    employeeList.forEach((empElement) => {
        const targetRow = routeVehicleList.filter((routeVehicle) => {
            return routeVehicle.route_vehicle_id === empElement.route_vehicle_id;
        })[0];
        if (targetRow) {
            targetRow.employeeInfo.push({
                first_name: empElement.first_name,
                last_name: empElement.last_name,
                contact_no: empElement.contact_no
            });
        }
    });

    return callback(routeVehicleList);
}
