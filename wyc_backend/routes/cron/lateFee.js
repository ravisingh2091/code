const async = require('async');
const sequelize = require('sequelize');
const utils = require('../../lib/utils');
const db = require('../../database');
const Session = db.models.Session;
const Branch = db.models.Branch;
const FeeInvoice = db.models.FeeInvoice;
const StudentSection = db.models.StudentSection;
const FeeLate = db.models.FeeLate;

function lateFee(req, res, next) {
    const today = utils.getToday();
    Session.findAll({
        attributes: ['id', 'start_date', 'end_date'],
        include: [{
            required: true,
            attributes: ['id', 'late_fee_amt', 'late_fee_min_amt', 'recurring_late_duration'],
            model: Branch,
            as: 'branch'
        }],
        where: {
            status: 'Present',
            '$branch.enable_late_fee$': 1,
            '$branch.late_fee_amt$': {
                $gt: 0
            },
            '$branch.late_fee_min_amt$': {
                $gt: 0
            }
        }
    }).then((sessionList) => {
        if (sessionList.length) {
            return async.eachSeries(sessionList, (sessionInfo, callback) => {
                return FeeInvoice.findAll({
                    attributes: ['id', 'generate_date', 'due_date', 'next_late_fee_due_date', [sequelize.fn('SUM', sequelize.col('amount')), 'total_unpaid']],
                    include: [{
                        required: true,
                        attributes: ['id'],
                        model: StudentSection,
                        as: 'studentSection',
                        include: [{
                            required: true,
                            attributes: [],
                            model: Session,
                            as: 'session',
                        }]
                    }],
                    where: {
                        '$studentSection.session.branch_id$': sessionInfo.branch.id,
                        invoice_status: 'Open',
                        due_date: {
                            $lt: today
                        },
                        $or: [
                            { next_late_fee_due_date: null },
                            { next_late_fee_due_date: { $lt: today } }
                        ]
                    },
                    group: 'student_section_id'
                }).then((studentList) => {
                    if (studentList.length) {
                        const next_late_fee_due_date = utils.addDays(today, sessionInfo.branch.recurring_late_duration);
                        return async.eachSeries(studentList, (student, stuCallback) => {
                            const studentInfo = student.get();
                            if (studentInfo.total_unpaid > sessionInfo.branch.late_fee_min_amt) {
                                return FeeInvoice.findAll({
                                    where: {
                                        student_section_id: studentInfo.studentSection.id,
                                        invoice_status: 'Open',
                                        due_date: {
                                            $lt: today
                                        },
                                        $or: [
                                            { next_late_fee_due_date: null },
                                            { next_late_fee_due_date: { $lt: today } }
                                        ]
                                    },
                                    order: 'created_at'
                                }).then((invoiceList) => {
                                    let amount = 0;
                                    let invoiceArray = [];
                                    return async.eachSeries(invoiceList, (invoice, invoiceCallback) => {
                                        if (invoice.unpaid_amount > sessionInfo.branch.late_fee_min_amt) {
                                            return Promise.all([
                                                FeeInvoice.update(
                                                    {
                                                        next_late_fee_due_date
                                                    }, {
                                                        where: {
                                                            id: invoice.id
                                                        }
                                                    }),
                                                FeeLate.create({
                                                    student_section_id: studentInfo.studentSection.id,
                                                    description: 'Late fee (Inv. No : ' + invoice.id + ')',
                                                    amount: sessionInfo.branch.late_fee_amt,
                                                    date: today,
                                                    for_which_invoice: invoice.id,
                                                    status: '0'
                                                })
                                            ])
                                                .then(() => invoiceCallback());
                                        } else {
                                            amount += invoice.unpaid_amount;
                                            invoiceArray.push(invoice.id);
                                            if (amount > sessionInfo.branch.late_fee_min_amt) {
                                                const invoiceId = invoiceArray[invoiceArray.length - 1];
                                                return Promise.all([
                                                    FeeInvoice.update(
                                                        {
                                                            next_late_fee_due_date
                                                        }, {
                                                            where: {
                                                                id: {
                                                                    $in: invoiceArray
                                                                }
                                                            }
                                                        }),
                                                    FeeLate.create({
                                                        student_section_id: studentInfo.studentSection.id,
                                                        description: 'Late fee (Inv. No : ' + invoiceId + ')',
                                                        amount: sessionInfo.branch.late_fee_amt,
                                                        date: today,
                                                        for_which_invoice: invoiceId,
                                                        status: '0'
                                                    })
                                                ])
                                                    .then(() => {
                                                        amount = 0;
                                                        invoiceArray = [];
                                                        invoiceCallback();
                                                    });
                                            }
                                            invoiceCallback();
                                        }
                                    }, () => {
                                        stuCallback();
                                    });
                                });
                            } else {
                                stuCallback();
                            }
                        }, () => {
                            callback();
                        });
                    } else {
                        callback();
                    }
                });
            }, () => {
                res.json({
                    status: true,
                    message: 'Late fee generated successfully'
                });
            });
        } else {
            res.json({
                status: false,
                message: 'No school enable late fee'
            });
        }
    });
}

module.exports = lateFee;
