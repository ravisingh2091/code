const async = require('async');
const commonFee = require('../../common/fee');
const db = require('../../database');
const StudentSection = db.models.StudentSection;
const Student = db.models.Student;
const User = db.models.User;

function promote(req, res, next) {
    async.eachSeries(req.body, (student, callback) => {
        if (student.status !== 'COMPLETED') {
            Promise.all([
                StudentSection.findOrCreate({
                    defaults: {
                        session_id: student.to_session_id,
                        student_id: student.student_id,
                        section_id: student.to_section_id,
                    },
                    where: {
                        session_id: student.to_session_id,
                        student_id: student.student_id
                    }
                }),
                StudentSection.update({ status: student.status }, { where: { id: student.student_section_id } })
            ]).then(([adds]) => {
                if (student.amount !== '0') {
                    return commonFee.updateStuFeeInfo(student.student_id, student.student_section_id, adds[0].id, student.amount).then(() => {
                        callback();
                    });
                } else {
                    callback();
                }
            });
        } else {
            Promise.all([
                StudentSection.update({ status: student.status }, { where: { id: student.student_section_id } }),
                Student.update({ status: 0 }, { where: { id: student.student_id } }),
                User.update({ status: 0 }, {
                    where: {
                        user_id: student.parent_id,
                        type: 'Parent'
                    }
                })
            ]).then(() => {
                callback();
            });
        }
    }, (err) => {
        if (err) {
            next(err);
        }
        res.json({
            status: true,
            message: 'Selected student promoted successfully'
        });
    });
}

module.exports = promote;
