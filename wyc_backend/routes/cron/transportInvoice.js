const async = require('async'),
    utils = require('../../lib/utils'),
    commonTransport = require('../../common/transport'),
    db = require('../../database'),
    Session = db.models.Session,
    Branch = db.models.Branch,
    StudentSection = db.models.StudentSection,
    Student = db.models.Student,
    RouteStop = db.models.RouteStop,
    Stops = db.models.Stops,
    TransportInvoice = db.models.TransportInvoice,
    TransportDiscount = db.models.TransportDiscount,
    Route = db.models.Route;

function transportInvoice(req, res, next) {
    const getMonthDay = utils.getToday('DD');
    const from_date = utils.getMonthFirstDate();
    const till_date = utils.getMonthLastDate();

    Session.findAll({
        attributes: ['id', 'start_date', 'end_date'],
        include: [{
            required: true,
            attributes: ['id', 'trans_invoice_due_date_diff', 'transport_enable_date'],
            model: Branch,
            as: 'branch'
        }],
        where: {
            status: 'Present',
            '$branch.trans_invoice_generation_day$': getMonthDay,
            '$branch.transport_status$': '1'
        }
    }).then((sessionLists) => {
        if (sessionLists.length > 0) {
            return async.eachSeries(sessionLists, (session, sessionCallback) => {
                return StudentSection.findAll({
                    attributes: ['id'],
                    include: [{
                        required: true,
                        attributes: ['id', 'mode_of_transport', 'route_stop_id', 'transport_type', 'trans_enable_date', 'trans_invoice_till_date'],
                        model: Student,
                        as: 'student',
                        include: [{
                            attributes: ['id'],
                            model: RouteStop,
                            as: 'routeStop',
                            include: [{
                                required: true,
                                attributes: ['id', 'name', 'stu_one_fee', 'stu_both_fee'],
                                model: Stops,
                                as: 'stops'
                            }, {
                                required: true,
                                attributes: ['id', 'name'],
                                model: Route,
                                as: 'route'
                            }]
                        }]
                    }, {
                        required: true,
                        attributes: ['id'],
                        model: Session,
                        as: 'session',
                        include: [{
                            required: true,
                            attributes: ['id', 'transport_enable_date'],
                            model: Branch,
                            as: 'branch'
                        }]
                    }],
                    where: {
                        status: 'STUDYING',
                        session_id: session.id,
                        '$student.mode_of_transport$': 'Bus',
                        '$student.trans_enable_date$': {
                            $ne: null
                        },
                        '$session.branch.transport_enable_date$': {
                            $ne: null
                        }
                    }
                }).then((studentLists) => {
                    if (studentLists.length > 0) {
                        return async.eachSeries(studentLists, (student, studentCallBack) => {
                            const amount = student.student.transport_type === 'Both' ? student.student.routeStop.stops.stu_both_fee : student.student.routeStop.stops.stu_one_fee;
                            if (amount) {
                                const schoolEnableDate = utils.formatDate(student.session.branch.transport_enable_date);

                                console.log(schoolEnableDate, 'schoolEnableDate');

                                const stuEnableDate = utils.formatDate(student.student.trans_enable_date);

                                console.log(stuEnableDate, 'stuEnableDate');

                                const firstInvoiceStartDate = schoolEnableDate > stuEnableDate ? schoolEnableDate : stuEnableDate;

                                console.log(firstInvoiceStartDate, 'firstInvoiceStartDate');

                                const lastInvoiceDate = utils.formatDate(student.student.trans_invoice_till_date);

                                console.log(lastInvoiceDate, 'lastInvoiceDate');

                                const finalInvoiceStartDate = firstInvoiceStartDate > lastInvoiceDate || lastInvoiceDate === null ? firstInvoiceStartDate : utils.addDays(lastInvoiceDate);

                                console.log(finalInvoiceStartDate, 'finalInvoiceStartDate');

                                return commonTransport.getStudentTransportDiscount(student.id, finalInvoiceStartDate, till_date).then((discountInfo) => {
                                    if (till_date > finalInvoiceStartDate || discountInfo.length > 0) {
                                        return getFinalArray(till_date, finalInvoiceStartDate, discountInfo, (result) => {
                                            const transportFee = result.monthCount * parseInt(amount);
                                            const invoiceAmount = transportFee + result.discountAmount;

                                            TransportInvoice.create({
                                                student_section_id: student.id,
                                                description: 'Transport Fee',
                                                amount: transportFee,
                                                generate_date: utils.getToday(),
                                                from_date: from_date,
                                                to_date: till_date,
                                                route_name: student.student.routeStop.route.name,
                                                stop_name: student.student.routeStop.stops.name,
                                                due_date: utils.addDays(new Date(), session.branch.trans_invoice_due_date_diff),
                                                invoice_amount: invoiceAmount,
                                                unpaid_amount: invoiceAmount > 0 ? invoiceAmount : 0,
                                                status: 'Open'
                                            }).then((invoice) => {
                                                async.eachSeries(result.discountData, (element, callback) => {
                                                    TransportDiscount.update({ status: '1', trans_invoice_id: invoice.id }, { where: { id: element.id } }).then(() => {
                                                        callback();
                                                    });
                                                }, (err) => {
                                                    if (err) {
                                                        next(err);
                                                    }
                                                    if (invoiceAmount < 0) {
                                                        return commonTransport.updateInvoiceAmount(student.id, Math.abs(invoiceAmount)).then(() => {
                                                            return commonTransport.updateStuTransportDueAmount(student.id, invoiceAmount, till_date).then(() => {
                                                                studentCallBack();
                                                            });
                                                        });
                                                    } else {
                                                        commonTransport.updateStuTransportDueAmount(student.id, invoiceAmount, till_date).then(() => {
                                                            studentCallBack();
                                                        });
                                                    }
                                                });
                                            });
                                        });
                                    } else {
                                        studentCallBack();
                                    }
                                });
                            } else {
                                studentCallBack();
                            }
                        }, (err) => {
                            if (err) {
                                next(err);
                            }
                            sessionCallback();
                        });
                    } else {
                        sessionCallback();
                    }
                });
            }, (err) => {
                if (err) {
                    next(err);
                }
                res.json({
                    status: true,
                    message: 'Transport Invocie generated successfully'
                });
            });
        } else {
            res.json({
                status: false,
                message: 'No school invoice'
            });
        }
    });
}

module.exports = transportInvoice;


function getFinalArray(till_date, finalInvoiceStartDate, discountInfo, callback) {
    const discountData = [];
    let monthCount = 0;
    let discountAmount = 0;

    while (till_date > finalInvoiceStartDate) {
        monthCount++;
        finalInvoiceStartDate = utils.addMonthWithLastDate(finalInvoiceStartDate);
    }

    if (discountInfo.length > 0) {
        discountInfo.forEach(element => {
            discountData.push({
                id: element.id,
                description: element.description,
                amonth: element.amount,
                type: element.type
            });

            discountAmount = element.type === 'Discount' ? discountAmount + parseInt(element.amount) : discountAmount - parseInt(element.amount);
        });
    }
    return callback({ discountData, discountAmount, monthCount });
}
