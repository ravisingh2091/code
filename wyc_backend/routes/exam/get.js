const db = require('../../database');
const Exam = db.models.Exam;

function get(req, res, next) {
    Exam.findById(req.query.id).then((result) => {
        res.json({
            status: true,
            message: 'Exam info get successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = get;
