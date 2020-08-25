const db = require('../../database');
const TransportPayment = db.models.TransportPayment;

function studentPayment(req, res, next) {
    return TransportPayment.findAll({
        where: {
            student_section_id: req.query.stu_sec_id
        },
        order: 'created_at DESC'
    }).then((result) => {
        res.json({
            status: true,
            message: 'student payments listed successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = studentPayment;
