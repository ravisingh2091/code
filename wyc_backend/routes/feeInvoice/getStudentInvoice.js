const commonStudent = require('../../common/student'),
    commonFee = require('../../common/fee'),
    db = require('../../database'),
    FeeInvoice = db.models.FeeInvoice,
    FeeInvoiceInfo = db.models.FeeInvoiceInfo,
    FeeHead = db.models.FeeHead;

function getStudentInvoice(req, res, next) {
    FeeInvoice.findOne({
        where: {
            student_section_id: req.query.student_id
        },
        order: 'created_at DESC'
    }).then((stuInvoice) => {
        if (stuInvoice) {
            return Promise.all([
                FeeInvoiceInfo.findAll({
                    attributes: ['id', 'amount'],
                    include: [{
                        required: true,
                        attributes: ['id', 'name', 'periodicity'],
                        model: FeeHead,
                        as: 'feeHead'
                    }],
                    where: { invoice_id: stuInvoice.id }
                }),
                commonFee.getInvoiceDiscount(stuInvoice.id),
                commonFee.getInvoiceLateFee(stuInvoice.id),
                commonFee.getInvoiceFeeCarryForward(stuInvoice.id),
                commonStudent.studentSectionInfo(req.query.student_id)
            ]).then(([feeHeads, discounts, lateFees, carryForward, studentInfo]) => {
                return res.json({
                    status: true,
                    message: 'student last invoice get successfully',
                    data: {
                        invoice: stuInvoice,
                        feeInfo: feeHeads,
                        discountInfo: discounts,
                        lateFeeInfo: lateFees,
                        carryForward,
                        dueInfo: {
                            due_amount: studentInfo.student.due_amount,
                            payable_amount: studentInfo.student.payable_amount
                        }
                    }
                });
            });
        }
        res.json({
            status: false,
            message: 'No Invoice generated'
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = getStudentInvoice;
