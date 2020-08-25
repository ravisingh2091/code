const db = require('../../database');
const PatternExam = db.models.PatternExam;
const ExtraExpenditureSubHead = db.models.ExtraExpenditureSubHead;

function del(req, res, next) {
    // PatternExam.findOne({ where: { exam_id: req.query.id } }).then((exam) => {
    //     if (!exam) {
    //         return 
            
    ExtraExpenditureSubHead.destroy({ where: { id: req.query.id } }).then(() => {
                res.json({
                    status: true,
                    message: 'Head deleted successfully'
                });
            }).catch((err) => {
                next(err);
            });;
    //     }
    //     res.json({
    //         status: false,
    //         message: 'Exam assign to pattern'
    //     });
    // }).catch((err) => {
    //     next(err);
    // });
}

module.exports = del;
