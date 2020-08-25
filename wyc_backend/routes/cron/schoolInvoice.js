const async = require('async');
const utils = require('../../lib/utils');
const commonFee = require('../../common/fee');
const db = require('../../database');
const Session = db.models.Session;
const Branch = db.models.Branch;
const StudentSection = db.models.StudentSection;
const Student = db.models.Student;
const Section = db.models.Section;
const FeeSchedule = db.models.FeeSchedule;
const FeeStructureInfo = db.models.FeeStructureInfo;
const FeeHead = db.models.FeeHead;
const FeeInvoice = db.models.FeeInvoice;
const FeeInvoiceInfo = db.models.FeeInvoiceInfo;
const FeeDiscount = db.models.FeeDiscount;
const FeeLate = db.models.FeeLate;
const FeeCarryForward = db.models.FeeCarryForward;

function schoolInvoice(req, res, next) {
    const getMonthDay = utils.getToday('DD');
    const today = utils.getToday();
    const month = utils.getMonthLastDate();

    Session.findAll({
        attributes: ['id', 'start_date', 'end_date'],
        include: [{
            required: true,
            attributes: ['id', 'invoice_due_date_diff'],
            model: Branch,
            as: 'branch'
        }],
        where: {
            status: 'Present',
            '$branch.invoice_generation_day$': getMonthDay,
        }
    }).then((sessionLists) => {
        if (sessionLists.length > 0) {
            return async.eachSeries(sessionLists, (session, sessionCallback) => {
                return StudentSection.findAll({
                    attributes: ['id', 'roll_no', 'student_type'],
                    include: [{
                        required: true,
                        attributes: ['id', 'class_id'],
                        model: Section,
                        as: 'section'
                    }, {
                        required: true,
                        attributes: ['id', 'fee_category_id', 'due_amount', 'payable_amount', 'invoice_generated_till_date'],
                        model: Student,
                        as: 'student'
                    }],
                    where: {
                        status: 'STUDYING',
                        session_id: session.id
                    }
                }).then((studentLists) => {
                    if (studentLists.length > 0) {
                        const invoice_due_date = utils.addDays(today, session.branch.invoice_due_date_diff);
                        return async.eachSeries(studentLists, (student, stuCallBack) => {
                            if (student.student.fee_category_id) {
                                return commonFee.getFeeStructureInfo(student.section.class_id, student.student.fee_category_id, session.id).then((feeStructureInfo) => {
                                    if (feeStructureInfo.status === true) {
                                        const whereCondition = {
                                            '$feeStructureInfo.fee_structure_id$': feeStructureInfo.structure_id,
                                            '$feeStructureInfo.fee_category_id$': student.student.fee_category_id,
                                            '$feeStructureInfo.session_id$': session.id,
                                        };
                                        return commonFee.getStudentLastInvoice(student.id).then((stuInvoice) => {
                                            if (stuInvoice) {
                                                whereCondition.$or = [{
                                                    due_date: {
                                                        $gt: utils.formatDate(student.student.invoice_generated_till_date),
                                                        $lte: month
                                                    },
                                                }, {
                                                    due_date: {
                                                        $gt: utils.formatDate(stuInvoice.generate_date),
                                                        $lte: month
                                                    },
                                                    generate_date: {
                                                        $gt: utils.formatDate(stuInvoice.generate_date)
                                                    }
                                                }];
                                                whereCondition.$not = { '$feeStructureInfo.feeHead.periodicity$': 'Once' };
                                            } else {
                                                whereCondition.due_date = {
                                                    lte: month
                                                };
                                                if (student.student_type === 'OLD') {
                                                    whereCondition.$not = { '$feeStructureInfo.feeHead.periodicity$': 'Once' };
                                                }
                                            }
                                            return FeeSchedule.findAll({
                                                attributes: ['id', 'due_date', 'amount'],
                                                include: [{
                                                    required: true,
                                                    attributes: ['id', 'first_due_date'],
                                                    model: FeeStructureInfo,
                                                    as: 'feeStructureInfo',
                                                    include: [{
                                                        required: true,
                                                        attributes: ['id', 'name'],
                                                        model: FeeHead,
                                                        as: 'feeHead'
                                                    }]
                                                }],
                                                where: whereCondition,
                                                order: 'due_date'
                                            }).then((feeScheduleInfo) => {
                                                return commonFee.getFeeDiscount(student.id, month).then((discountInfo) => {
                                                    return commonFee.getLateFee(student.id).then((lateFeeInfo) => {
                                                        return commonFee.getStudentFeeCarryForward(student.id, '0').then((carryForward) => {
                                                            if (feeScheduleInfo.length > 0 || discountInfo.length > 0 || lateFeeInfo.length > 0 || carryForward) {
                                                                return getScheduleList(feeScheduleInfo, discountInfo, lateFeeInfo, carryForward, (result) => {
                                                                    const fromDate = new Date(session.start_date) > new Date(result.final[0].due_date) ? utils.formatDate(session.start_date) : utils.getMonthFirstDate(result.final[0].due_date);
                                                                    return FeeInvoice.create({
                                                                        student_section_id: student.id,
                                                                        generate_date: today,
                                                                        from_date: fromDate,
                                                                        to_date: month,
                                                                        due_date: invoice_due_date,
                                                                        amount: result.invoiceAmount,
                                                                        unpaid_amount: result.invoiceAmount
                                                                    }).then((invoice) => {
                                                                        return async.eachSeries(result.final, (schedule, callback) => {
                                                                            if (schedule.type === 'Schedule') {
                                                                                FeeInvoiceInfo.create({
                                                                                    invoice_id: invoice.id,
                                                                                    fee_head_id: schedule.head_id,
                                                                                    amount: schedule.amount
                                                                                }).then(() => callback());
                                                                            } else if (schedule.type === 'Late') {
                                                                                FeeLate.update({
                                                                                    status: '1',
                                                                                    added_invoice: invoice.id
                                                                                }, { where: { id: schedule.id } })
                                                                                    .then(() => callback());
                                                                            } else if (schedule.type === 'CarryForward') {
                                                                                FeeCarryForward.update({
                                                                                    status: '1',
                                                                                    invoice_id: invoice.id
                                                                                }, { where: { id: schedule.id } })
                                                                                    .then(() => callback());
                                                                            } else {
                                                                                FeeDiscount.update({
                                                                                    status: '1',
                                                                                    invoice_id: invoice.id
                                                                                }, { where: { id: schedule.id } })
                                                                                    .then(() => callback());
                                                                            }
                                                                        }, () => {
                                                                            if (result.invoiceAmount < 0) {
                                                                                return commonFee.updateInvoiceAmount(student.id, Math.abs(result.invoiceAmount)).then(() => {
                                                                                    return commonFee.updateStudentDueAmount(student.id, result.invoiceAmount, month).then(() => {
                                                                                        stuCallBack();
                                                                                    });
                                                                                });
                                                                            } else {
                                                                                return commonFee.updateStudentDueAmount(student.id, result.invoiceAmount, month).then(() => {
                                                                                    stuCallBack();
                                                                                });
                                                                            }
                                                                        });
                                                                    });
                                                                });
                                                            } else {
                                                                // console.log('***********');
                                                                // console.log('No schedule');
                                                                // console.log('^^^^^^^^^^^');
                                                                stuCallBack();
                                                            }
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    } else {
                                        // console.log('***********');
                                        // console.log('No Fee Structure Info');
                                        // console.log('^^^^^^^^^^^');
                                        stuCallBack();
                                    }
                                });
                            } else {
                                // console.log('***********');
                                // console.log('Kindly assign student Fee Category');
                                // console.log('^^^^^^^^^^^');
                                stuCallBack();
                            }
                        }, () => {
                            sessionCallback();
                        });
                    } else {
                        // console.log('***********');
                        // console.log('No Student Found');
                        // console.log('^^^^^^^^^^^');
                        sessionCallback();
                    }
                });
            }, () => {
                res.json({
                    status: true,
                    message: 'Auto invoice generated successfully'
                });
            });
        } else {
            res.json({
                status: false,
                message: 'No branch found for invoice generation'
            });
        }
    }).catch((err) => {
        next(err);
    });
}

module.exports = schoolInvoice;

function getScheduleList(schedule, discount, lateFee, carryForward, callback) {
    const final = [];
    let invoiceAmount = 0;
    if (schedule.length > 0) {
        schedule.forEach(element => {
            final.push({
                id: element.id,
                due_date: element.due_date,
                amount: element.amount,
                head_id: element.feeStructureInfo.feeHead.id,
                head_name: element.feeStructureInfo.feeHead.name,
                type: 'Schedule'
            });
            invoiceAmount = invoiceAmount + element.amount;
        });
    }

    if (carryForward) {
        final.push({
            id: carryForward.id,
            due_date: carryForward.date,
            amount: carryForward.amount,
            description: carryForward.description,
            type: 'CarryForward'
        });
        invoiceAmount = invoiceAmount + carryForward.amount;
    }

    if (discount.length > 0) {
        discount.forEach(element => {
            final.push({
                id: element.id,
                due_date: element.date,
                amount: element.amount,
                description: element.description,
                type: element.type
            });
            if (element.type === 'Discount') {
                invoiceAmount = invoiceAmount - element.amount;
            } else {
                invoiceAmount = invoiceAmount + element.amount;
            }
        });
    }

    if (lateFee.length > 0) {
        lateFee.forEach(element => {
            final.push({
                id: element.id,
                due_date: element.date,
                amount: element.amount,
                description: element.description,
                type: 'Late'
            });
            invoiceAmount = invoiceAmount + element.amount;
        });
    }

    final.sort(function (a, b) {
        const date1 = new Date(a.due_date);
        const date2 = new Date(b.due_date);
        return date1 - date2;
    });

    return callback({ final, invoiceAmount });
}
