const db = require('../../database');
const PatternExam = db.models.PatternExam;
const Exam = db.models.Exam;

function del(req, res, next) {
    PatternExam.findOne({ where: { exam_id: req.query.id } }).then((exam) => {
        if (!exam) {
            return Exam.destroy({ where: { id: req.query.id } }).then(() => {
                res.json({
                    status: true,
                    message: 'Exam deleted successfully'
                });
            });
        }
        res.json({
            status: false,
            message: 'Exam assign to pattern'
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = del;
