const db = require('../../database');
const PatternExam = db.models.PatternExam;
const ExtraCollectionPayment = db.models.ExtraCollectionPayment;
const ExtraCollectionBoucherPayment= db.models.ExtraCollectionBoucherPayment;
function del(req, res, next) {
    // PatternExam.findOne({ where: { exam_id: req.query.id } }).then((exam) => {
    //     if (!exam) {
    //         return 
            
    ExtraCollectionBoucherPayment.destroy({ where: { id: req.query.id } }).then(() => {
                res.json({
                    status: true,
                    message: 'Payment deleted successfully'
                });
                ExtraCollectionPayment.destroy({ where: { payment_boucher_id: req.query.id } }).then(() => {
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
