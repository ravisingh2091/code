const db = require('../../database');
const TransportInvoice = db.models.TransportInvoice;

function studentInvoiceList(req, res, next) {
    TransportInvoice.findAll({
        where: {
            student_section_id: req.query.stu_sec_id,
        },
        order: 'created_at DESC'
    }).then((result) => {
        res.json({
            status: true,
            message: 'student invoice listed successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = studentInvoiceList;
