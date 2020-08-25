const async = require('async'),
    db = require('../../database'),
    Student = db.models.Student;

function bulkUpdate(req, res, next) {
    const data = req.body;

    async.eachSeries(data, (student, callback) => {
        Student.update({
            due_amount: student.payable_amount > 0 ? student.payable_amount : 0,
            payable_amount: student.payable_amount,
        }, { where: { id: student.student_id } }).then(() => callback());
    }, (err) => {
        if (err) {
            next(err);
        }
        res.json({
            status: true,
            message: 'Students bulk payment upload successfully\n No. Recipt no. is genrate in bulk upload'
        });
    });
}

module.exports = bulkUpdate;
