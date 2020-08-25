const db = require('../../database');
const PatternExam = db.models.PatternExam;
const ExtraExpenditurePayment = db.models.ExtraExpenditurePayment;
const ExtraExpenditureBoucherPayment= db.models.ExtraExpenditureBoucherPayment;
function del(req, res, next) {
    // PatternExam.findOne({ where: { exam_id: req.query.id } }).then((exam) => {
    //     if (!exam) {
    //         return 
            
    ExtraExpenditureBoucherPayment.destroy({ where: { id: req.query.id } }).then(() => {
                res.json({
                    status: true,
                    message: 'Payment deleted successfully'
                });
                ExtraExpenditurePayment.destroy({ where: { payment_boucher_id: req.query.id } }).then(() => {
                    // res.json({
                    //     status: true,
                    //     message: 'Payment deleted successfully'
                    // });
                }).catch((err) => {
                    //next(err);
                });;
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
