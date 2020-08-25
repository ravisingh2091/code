const commonTransport = require('../../common/transport');
const db = require('../../database');
const TransportInvoice = db.models.TransportInvoice;
const StudentSection = db.models.StudentSection;
const Student = db.models.Student;
const Section = db.models.Section;
const Class = db.models.Class;

function get(req, res, next) {
    Promise.all([
        TransportInvoice.findOne({
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
            where: { id: req.query.id }
        }),
        commonTransport.getInvoiceDiscount(req.query.id)
    ]).then(([invoiceInfo, discountInfo]) => {
        res.json({
            status: true,
            message: 'Transport invoice info get successfully',
            data: {
                invoiceInfo: invoiceInfo,
                discountInfo: discountInfo
            }
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = get;
