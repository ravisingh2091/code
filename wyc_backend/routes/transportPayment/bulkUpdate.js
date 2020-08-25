const async = require('async');
const utils = require('../../lib/utils');
const db = require('../../database');
const Student = db.models.Student;
function bulkUpdate(req, res, next) {
    const data = req.body;

    async.eachSeries(data, (student, callback) => {
        Student.update({
            trans_due_amount: student.trans_payable_amount > 0 ? student.trans_payable_amount : 0,
            trans_payable_amount: student.trans_payable_amount,
            trans_enable_date: utils.formatDate(student.transport_enable_date)
        }, { where: { id: student.student_id } }).then(() => callback());
    }, (err) => {
        if (err) {
            next(err);
        }
        res.json({
            status: true,
            message: 'Students transport amount and enable date updated'
        });
    });
}

module.exports = bulkUpdate;
