const db = require('../../database');
const FeePayment = db.models.FeePayment;

function studentPayment(req, res, next) {
    return FeePayment.findAll({
        where: {
            student_section_id: req.query.student_id
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
