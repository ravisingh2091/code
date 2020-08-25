const db = require('../../database');
const Exam = db.models.Exam;

function list(req, res, next) {
    Exam.findAll({
        where: {
            branch_id: req.query.branch_id
        }
    }).then((result) => {
        res.json({
            status: true,
            message: 'Exam listed successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = list;
