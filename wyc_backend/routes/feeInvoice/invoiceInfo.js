const commonFee = require('../../common/fee'),
    db = require('../../database'),
    FeeInvoiceInfo = db.models.FeeInvoiceInfo,
    FeeInvoice = db.models.FeeInvoice,
    FeeHead = db.models.FeeHead,
    StudentSection = db.models.StudentSection,
    Student = db.models.Student,
    Section = db.models.Section,
    Class = db.models.Class;

function getInvoiceInfo(req, res, next) {
    const invoice_id = req.query.invoice_id;

    Promise.all([
        FeeInvoice.findOne({
            include: [{
                required: true,
                attributes: ['id'],
                model: StudentSection,
                as: 'studentSection',
                include: [{
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
                },
                {
                    required: true,
                    attributes: ['id', 'admission_no', 'first_name', 'last_name', 'photo'],
                    model: Student,
                    as: 'student'
                }]
            }],
            where: { id: invoice_id }
        }),
        FeeInvoiceInfo.findAll({
            include: [{
                required: true,
                attributes: ['id', 'name', 'periodicity'],
                model: FeeHead,
                as: 'feeHead'
            }],
            where: { invoice_id }
        }),
        commonFee.getInvoiceDiscount(invoice_id),
        commonFee.getInvoiceLateFee(invoice_id),
        commonFee.getInvoiceFeeCarryForward(invoice_id)
    ]).then(([invoice, invoiceInfo, discount, lateFee, carryForward]) => {
        return res.json({
            status: true,
            message: 'Invoice info listed successfully',
            data: {
                invoice,
                invoiceInfo,
                discount,
                lateFee,
                carryForward
            }
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = getInvoiceInfo;
