const db = require('../../database');
const StudentSection = db.models.StudentSection;
const Student = db.models.Student;
const TransportInvoice = db.models.TransportInvoice;
const TransportDiscount = db.models.TransportDiscount;

function getTransStuInvoice(req, res, next) {
    TransportInvoice.findOne({
        include: [{
            attributes: ['id', 'roll_no'],
            required: true,
            model: StudentSection,
            as: 'studentSection',
            include: [{
                required: true,
                attributes: ['id', 'trans_due_amount', 'trans_payable_amount'],
                model: Student,
                as: 'student'
            }]
        }],
        where: {
            student_section_id: req.query.stu_sec_id
        },
        order: 'created_at DESC'
    }).then((stuInvoice) => {
        if (stuInvoice) {
            return TransportDiscount.findAll({
                attributes: ['id', 'description', 'amount', 'date', 'type'],
                where: { trans_invoice_id: stuInvoice.id }
            }).then((discountInfo) => {
                return res.json({
                    status: true,
                    message: 'student last invoice get successfully',
                    data: {
                        invoice: stuInvoice,
                        discountInfo: discountInfo
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

module.exports = getTransStuInvoice;
