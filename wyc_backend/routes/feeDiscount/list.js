const db = require('../../database');
const FeeDiscount = db.models.FeeDiscount;

function list(req, res, next) {
    FeeDiscount.findAll({
        where: { student_section_id: req.query.stu_sec_id }
    }).then((result) => {
        res.json({
            status: true,
            message: 'Student discount listed successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = list;
