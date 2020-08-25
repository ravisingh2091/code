const db = require('../../database');
const PatternExam = db.models.PatternExam;
const ExtraExpenditureHead = db.models.ExtraExpenditureHead;
const ExtraExpenditureSubHead = db.models.ExtraExpenditureSubHead;
function del(req, res, next) {
    ExtraExpenditureSubHead.findOne({ where: { head_id: req.query.id } }).then((subhead) => {
        if (!subhead) {
             
            
            return ExtraExpenditureHead.destroy({ where: { id: req.query.id } }).then(() => {
                res.json({
                    status: true,
                    message: 'Head deleted successfully'
                });
            }).catch((err) => {
                next(err);
            });;
        }
        res.json({
            status: false,
            message: 'Head assign to Sub head'
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = del;
