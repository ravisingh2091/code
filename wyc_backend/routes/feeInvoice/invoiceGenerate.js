const utils = require('../../lib/utils'),
    commonFee = require('../../common/fee'),
    commonSchool = require('../../common/school'),
    commonStudent = require('../../common/student'),
    db = require('../../database'),
    FeeStructureInfo = db.models.FeeStructureInfo,
    FeeSchedule = db.models.FeeSchedule,
    FeeHead = db.models.FeeHead;

function invoiceGenerate(req, res, next) {
    const student_id = req.query.student_section_id;
    const session_id = req.query.session_id;
    const month = req.query.month;

    return commonStudent.studentSectionInfo(student_id).then((studentInfo) => {
        if (studentInfo.student.fee_category_id) {
            return commonFee.getFeeStructureInfo(studentInfo.section.class_id, studentInfo.student.fee_category_id, session_id).then((feeStructureInfo) => {
                if (feeStructureInfo.status === true) {
                    const whereCondition = {
                        '$feeStructureInfo.fee_structure_id$': feeStructureInfo.structure_id,
                        '$feeStructureInfo.fee_category_id$': studentInfo.student.fee_category_id,
                        '$feeStructureInfo.session_id$': session_id,
                    };
                    return commonFee.getStudentLastInvoice(student_id).then((stuInvoice) => {
                        if (stuInvoice) {
                            whereCondition.$or = [{
                                due_date: {
                                    $gt: utils.formatDate(studentInfo.student.invoice_generated_till_date),
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
                            if (studentInfo.student_type === 'OLD') {
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
                            return commonFee.getFeeDiscount(student_id, month).then((discountInfo) => {
                                return commonFee.getLateFee(student_id).then((lateFeeInfo) => {
                                    return commonFee.getStudentFeeCarryForward(student_id, '0').then((carryForward) => {
                                        if (feeScheduleInfo.length > 0 || discountInfo.length > 0 || lateFeeInfo.length > 0 || carryForward) {
                                            return commonSchool.getBranchInfo(req.query.branch_id).then((branchInfo) => {
                                                return getScheduleList(feeScheduleInfo, discountInfo, lateFeeInfo, carryForward, (result) => {
                                                    const fromDate = new Date(studentInfo.session.start_date) > new Date(result.final[0].due_date) ? utils.formatDate(studentInfo.session.start_date) : utils.getMonthFirstDate(result.final[0].due_date);
                                                    return res.json({
                                                        status: true,
                                                        message: 'Invoice info listed successfully',
                                                        data: {
                                                            invoiceAmount: result.invoiceAmount,
                                                            invoice_generated_till_date: studentInfo.student.invoice_generated_till_date,
                                                            dueAmount: studentInfo.student.due_amount,
                                                            payable_amount: studentInfo.student.payable_amount,
                                                            total_amt: studentInfo.student.payable_amount + result.invoiceAmount,
                                                            from_date: fromDate,
                                                            to_date: month,
                                                            due_date: utils.addDays(new Date(), branchInfo.invoice_due_date_diff),
                                                            schedule: result.final
                                                        }
                                                    });
                                                });
                                            });
                                        } else {
                                            const tillDate = utils.formatDate(studentInfo.student.invoice_generated_till_date, 'MMMM-YYYY');
                                            return res.json({
                                                status: false,
                                                message: `Invoice already generated upto ${tillDate}`
                                            });
                                        }
                                    });
                                });
                            });
                        });
                    });
                } else {
                    return res.json(feeStructureInfo);
                }
            });
        } else {
            return res.json({
                status: false,
                message: 'Assign Student Fee Category'
            });
        }
    }).catch((err) => {
        next(err);
    });
}

module.exports = invoiceGenerate;

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
