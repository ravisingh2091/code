'use strict';
const async = require('async');
const utils = require('../lib/utils');
const commonStudent = require('../common/student');
const db = require('../database');
const Route = db.models.Route;
const Vehicle = db.models.Vehicle;
const RouteStop = db.models.RouteStop;
const RouteVehicle = db.models.RouteVehicle;
const Stops = db.models.Stops;
const TransportInvoice = db.models.TransportInvoice;
const TransportDiscount = db.models.TransportDiscount;
const TransportPayment = db.models.TransportPayment;
const StudentSection = db.models.StudentSection;
const TransDiscount = db.models.TransDiscount;
const Student = db.models.Student;
const Parent = db.models.Parent;
const Section = db.models.Section;
const Class = db.models.Class;
const Branch = db.models.Branch;
const Session = db.models.Session;

const transport = {
    /**
     * Update pick order when add or remove stop from particular route
     * @param route_id
     * @param order_no
     * @param type
     */
    updatePickOrder: (route_id, order_no, type) => {
        const whereCondition = { route_id };
        if (type === 'Add') {
            whereCondition.pick_order = {
                $gte: order_no
            };
        } else {
            whereCondition.pick_order = {
                $gt: order_no
            };
        }
        RouteStop.findAll({
            where: whereCondition
        }).then((stopList) => {
            if (stopList.length > 0) {
                async.eachSeries(stopList, (stopInfo, callback) => {
                    const pick_order = type === 'Add' ? parseInt(stopInfo.pick_order) + 1 : parseInt(stopInfo.pick_order) - 1;
                    RouteStop.update(
                        {
                            pick_order
                        }, {
                            where: {
                                id: stopInfo.id
                            }
                        })
                        .then(() => {
                            return callback();
                        });
                }, (err) => {
                    if (err) {
                        console.log(err);
                    }
                    return true;
                });
            } else {
                return true;
            }
        });
    },

    /**
     * Update drop order when add or remove particular stop from route
     * @param route_id
     * @param order_no
     * @param type
     */
    updateDropOrder: (route_id, order_no, type) => {
        const whereCondition = { route_id };
        if (type === 'Add') {
            whereCondition.drop_order = {
                $gte: order_no
            };
        } else {
            whereCondition.drop_order = {
                $gt: order_no
            };
        }
        RouteStop.findAll({
            where: whereCondition
        }).then((stopList) => {
            if (stopList.length > 0) {
                async.eachSeries(stopList, (stopInfo, callback) => {
                    const drop_order = type === 'Add' ? parseInt(stopInfo.drop_order) + 1 : parseInt(stopInfo.drop_order) - 1;
                    RouteStop.update(
                        {
                            drop_order
                        }, {
                            where: {
                                id: stopInfo.id
                            }
                        })
                        .then(() => {
                            return callback();
                        });
                }, (err) => {
                    if (err) {
                        console.log(err);
                    }
                    return true;
                });
            } else {
                return true;
            }
        });
    },

    /**
     * Update vehicle millage
     * @param id
     * @param current_reading
     * @returns {*}
     */
    updateVehicleReading: (id, current_reading) => {
        return Vehicle.update({ current_reading }, { where: { id } }).then(() => {
            return true;
        });
    },

    /**
     * Get Student invoice info for generate invoice
     * @param id
     * @returns {*}
     */
    getStudentInvoiceInfo: (id) => {
        return StudentSection.findOne({
            attributes: ['id', 'roll_no'],
            include: [{
                required: true,
                attributes: ['id', 'admission_no', 'first_name', 'last_name', 'mode_of_transport', 'route_stop_id', 'route_vehicle_id', 'slot', 'transport_type', 'trans_enable_date', 'trans_invoice_till_date', 'trans_due_amount', 'trans_payable_amount'],
                model: Student,
                as: 'student',
                include: [{
                    attributes: ['id'],
                    model: RouteStop,
                    as: 'routeStop',
                    include: [{
                        required: true,
                        model: Route,
                        as: 'route'
                    },
                    {
                        required: true,
                        model: Stops,
                        as: 'stops'
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
            }, {
                required: true,
                attributes: ['id', 'name', 'start_date', 'end_date'],
                model: Session,
                as: 'session',
                include: [{
                    required: true,
                    attributes: ['id', 'branch', 'trans_invoice_due_date_diff', 'transport_status', 'transport_enable_date'],
                    model: Branch,
                    as: 'branch'
                }]
            }],
            where: {
                id,
                '$student.mode_of_transport$': 'Bus',
                '$student.trans_enable_date$': {
                    $ne: null
                },
                '$session.branch.transport_enable_date$': {
                    $ne: null
                }
            }
        }).then((studentInfo) => {
            return studentInfo;
        });
    },

    /**
     * Get student transport discount for invoice generation
     * @param student_section_id
     * @param fromDate
     * @param toDate
     * @returns {*}
     */
    getStudentTransportDiscount: (student_section_id, fromDate, toDate) => {
        return TransportDiscount.findAll({
            where: {
                student_section_id,
                status: '0',
                date: {
                    $between: [fromDate, toDate]
                }
            }
        }).then((data) => {
            return data;
        });
    },

    /**
     * Update invoice unpaid amount and status when generate invoice and fee payment
     * @param student_section_id
     * @param pay_fee
     * @returns {*}
     */
    updateInvoiceAmount: (student_section_id, pay_fee) => {
        let amount = pay_fee;
        return TransportInvoice.findAll({
            where: {
                student_section_id,
                status: 'Open'
            },
            order: 'created_at'
        }).then((openList) => {
            if (openList.length) {
                return async.eachSeries(openList, (invoice, callback) => {
                    if (invoice.unpaid_amount <= amount) {
                        amount = amount - invoice.unpaid_amount;
                        TransportInvoice.update({ unpaid_amount: 0, status: 'Close' }, { where: { id: invoice.id } }).then(() => {
                            callback();
                        });
                    } else {
                        amount = invoice.unpaid_amount - amount;
                        TransportInvoice.update({ unpaid_amount: amount }, { where: { id: invoice.id } }).then(() => {
                            callback(true);
                        });
                    }
                }, (err) => {
                    if (err) {
                        return false;
                    }
                    return true;
                });
            } else {
                return true;
            }
        });
    },

    /**
     * Update student transport fee when generate invoice and fee payment
     * @param student_id
     * @param amount
     * @param to_date
     * @param payment
     * @returns {*}
     */
    updateStuTransportDueAmount: (student_id, amount, to_date = false, payment = false) => {
        return commonStudent.studentSectionInfo(student_id).then((studentInfo) => {
            const data = {};
            if (payment) {
                const newAmount = studentInfo.student.trans_payable_amount - amount;
                data.trans_payable_amount = newAmount;
                data.trans_due_amount = newAmount < 0 ? 0 : newAmount;
            } else {
                data.trans_due_amount = studentInfo.student.trans_payable_amount < 0 ? 0 : studentInfo.student.trans_payable_amount;
                data.trans_payable_amount = amount + studentInfo.student.trans_payable_amount;
                // first time update
                if (studentInfo.student.trans_invoice_till_date === null) {
                    data.trans_invoice_till_date = to_date;
                }
                // todate update
                if (to_date > utils.formatDate(studentInfo.student.trans_invoice_till_date)) {
                    data.trans_invoice_till_date = to_date;
                }
            }
            return Student.update(data, { where: { id: studentInfo.student.id } }).then(() => {
                return true;
            });
        });
    },

    /**
     * Get transport Invoice discount
     * @param trans_invoice_id
     * @returns {*}
     */
    getInvoiceDiscount: (trans_invoice_id) => {
        return TransportDiscount.findAll({ where: { trans_invoice_id } }).then((data) => {
            return data;
        });
    },

    /**
     * Get transport session payment
     * @param session_id
     * @returns {Promise.<T>}
     */
    getSessionCollection: (session_id) => {
        const includeCondtion = [{ required: true, model: StudentSection, as: 'studentSection' }];

        return Promise.all([
            TransportInvoice.sum('amount', {
                include: includeCondtion,
                where: { '$studentSection.session_id$': session_id }
            }),
            TransportInvoice.sum('unpaid_amount', {
                include: includeCondtion,
                where: { '$studentSection.session_id$': session_id }
            }),
            TransportPayment.sum('amount', {
                include: includeCondtion,
                where: { '$studentSection.session_id$': session_id }
            }),
            TransportPayment.sum('amount', {
                include: includeCondtion,
                where: { '$studentSection.session_id$': session_id, payment_mode: 'Cash' }
            }),
            TransportPayment.sum('amount', {
                include: includeCondtion,
                where: { '$studentSection.session_id$': session_id, payment_mode: 'Cheque' }
            }),
            TransportPayment.sum('amount', {
                include: includeCondtion,
                where: { '$studentSection.session_id$': session_id, payment_mode: 'Bank Deposit' }
            }),
            TransportPayment.sum('amount', {
                include: includeCondtion,
                where: { '$studentSection.session_id$': session_id, payment_mode: { $notIn: ['Cash', 'Cheque', 'Bank Deposit'] } }
            })
        ]).then(([total, unpaid, paid, cashTotal, chequeTotal, bankTotal, onlineTotal]) => {
            return {
                total: total ? total : 0,
                unpaid: unpaid ? unpaid : 0,
                paid: paid ? paid : 0,
                cashTotal: cashTotal ? cashTotal : 0,
                chequeTotal: chequeTotal ? chequeTotal : 0,
                bankTotal: bankTotal ? bankTotal : 0,
                onlineTotal: onlineTotal ? onlineTotal : 0
            };
        });
    },

    transportStudent: (data) => {
        const whereCondition = {
            mode_of_transport: 'Bus',
            route_stop_id: { $ne: null },
            route_vehicle_id: { $ne: null },
            status: 1,
        };


        if (data.msg_to === 'RouteVehicle') {
            whereCondition.route_vehicle_id = {
                $in: data.route_vehicle_id
            };
        }

        if (data.msg_to === 'Stop' && data.stop_id) {
            whereCondition['$routeStop.stop_id$'] = data.stop_id;
        }

        return Student.findAll({
            attributes: ['id'],
            include: [{
                required: true,
                attributes: ['id', 'contact_no'],
                model: Parent,
                as: 'parent'
            }, {
                required: true,
                attributes: ['id'],
                model: RouteVehicle,
                as: 'routeVehicle'
            }, {
                required: true,
                attributes: ['id'],
                model: RouteStop,
                as: 'routeStop'
            }],
            where: whereCondition
        }).then((transportStudent) => {
            return transportStudent;
        });
    },

    getTotalDueAmount: (branch_id) => {
        return StudentSection.sum('student.trans_payable_amount', {
            attributes: [],
            include: [{
                required: true,
                attributes: [],
                model: Session,
                as: 'session'
            }, {
                required: true,
                attributes: [],
                model: Student,
                as: 'student'
            }],
            where: {
                '$session.branch_id$': branch_id,
                status: 'STUDYING'
            }
        }).then((dueAmount) => {
            return dueAmount;
        });
    },

    getTotalPaid: (branch_id) => {
        return TransportPayment.sum('amount', {
            attributes: [],
            include: [{
                required: true,
                attributes: ['id', 'status'],
                model: StudentSection,
                as: 'studentSection',
                include: [{
                    required: true,
                    attributes: ['branch_id'],
                    model: Session,
                    as: 'session'
                }]
            }],
            where: {
                '$studentSection.status$': 'STUDYING',
                '$studentSection.session.branch_id$': branch_id
            }
        }).then((amount) => {
            return amount;
        });
    },
    getStudentCount: (branch_id) => {
        return StudentSection.count({
            attributes: [],
            include: [{
                required: true,
                attributes: [],
                model: Session,
                as: 'session'
            }, {
                required: true,
                attributes: [],
                model: Student,
                as: 'student'
            }],
            where: {
                status: 'STUDYING',
                '$student.mode_of_transport$': 'Bus',
                '$session.branch_id$': branch_id,
                '$session.status$': 'Present'
            }
        }).then(count => {
            return count;
        });
    },
     getTodaytransPayment: (branch_id) => {
            return TransportPayment.sum('amount', {
                attributes: [],
                include: [{
                    required: true,
                    attributes: [],
                    model: StudentSection,
                    as: 'studentSection',
                    include: [{
                        required: true,
                        attributes: ['branch_id'],
                        model: Session,
                        as: 'session'
                    }]
                }],
                where: {
                    payment_date: utils.getToday(),
                    '$studentSection.status$': 'STUDYING',
                    '$studentSection.session.branch_id$': branch_id
                }
            }).then((amount) => {
                return amount;
            });
        },

};

module.exports = transport;
