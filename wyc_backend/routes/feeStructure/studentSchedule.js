const commonFee = require('../../common/fee');
const commonStudent = require('../../common/student');
const db = require('../../database');
const FeeStructureInfo = db.models.FeeStructureInfo;
const FeeSchedule = db.models.FeeSchedule;
const FeeHead = db.models.FeeHead;
const FeeDiscount = db.models.FeeDiscount;
const FeePayment = db.models.FeePayment;
const FeeLate = db.models.FeeLate;

function studentSchedule(req, res, next) {
    const student_id = req.query.stu_sec_id;
    return commonStudent.studentSectionInfo(student_id).then((studentInfo) => {
        if (studentInfo.student.fee_category_id) {
            return commonFee.getFeeStructureInfo(studentInfo.section.class_id, studentInfo.student.fee_category_id, studentInfo.session_id).then((feeStructureInfo) => {
                if (feeStructureInfo.status === true) {
                    const whereCondition = {
                        '$feeStructureInfo.fee_structure_id$': feeStructureInfo.structure_id,
                        '$feeStructureInfo.fee_category_id$': studentInfo.student.fee_category_id,
                        '$feeStructureInfo.session_id$': studentInfo.session_id,
                    };

                    if (studentInfo.student_type === 'OLD') {
                        whereCondition.$not = { '$feeStructureInfo.feeHead.periodicity$': 'Once' };
                    }
                    return Promise.all([
                        FeeSchedule.findAll({
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
                        }),
                        FeeDiscount.findAll({ where: { student_section_id: student_id } }),
                        FeeLate.findAll({ where: { student_section_id: student_id } }),
                        FeeSchedule.sum('FeeSchedule.amount', {
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
                            where: whereCondition
                        }),
                        FeeDiscount.sum('amount', { where: { student_section_id: student_id, type: 'Discount' } }),
                        FeeDiscount.sum('amount', { where: { student_section_id: student_id, type: 'Penalty' } }),
                        FeePayment.sum('amount', { where: { student_section_id: student_id } })
                    ]).then(([schedule, discount, lateFee, schedule_amount, discount_amount, Penalty_amount, paid_amount]) => {
                        schedule_amount = schedule_amount ? schedule_amount : 0;
                        discount_amount = discount_amount ? discount_amount : 0;
                        Penalty_amount = Penalty_amount ? Penalty_amount : 0;
                        paid_amount = paid_amount ? paid_amount : 0;
                        const remaining_amount = schedule_amount + Penalty_amount - discount_amount - paid_amount;
                        res.json({
                            status: true,
                            message: 'Student session fee schedule get successfully',
                            data: {
                                schedule,
                                discount,
                                lateFee,
                                schedule_amount,
                                discount_amount,
                                Penalty_amount,
                                paid_amount,
                                remaining_amount
                            }
                        });
                    }).catch((err) => {
                        next(err);
                    });
                } else {
                    res.json(feeStructureInfo);
                }
            });
        } else {
            res.json({
                status: false,
                message: 'Fee category not assigned'
            });
        }
    });
}

module.exports = studentSchedule;
