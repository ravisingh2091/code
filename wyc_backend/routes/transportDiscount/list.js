const db = require('../../database');
const TransportDiscount = db.models.TransportDiscount;

function list(req, res, next) {
    TransportDiscount.findAll({
        where: { student_section_id: req.query.stu_sec_id }
    }).then((data) => {
        res.json({
            status: true,
            mssage: 'Transport Discount listed successfully',
            data
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = list;
