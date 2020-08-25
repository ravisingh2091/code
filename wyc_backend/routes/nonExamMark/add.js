const async = require('async');
const db = require('../../database');
const NonExamMark = db.models.NonExamMark;

function add(req, res, next) {
    async.eachSeries(req.body, (subjectInfo, callback) => {
        async.eachSeries(subjectInfo.students, (student, secondCB) => {
            NonExamMark.findOrCreate({
                defaults: {
                    schedule_section_id: student.schedule_section_id,
                    student_section_id: student.student_section_id,
                    subject_id: subjectInfo.subject_id,
                    remarks: student.remarks
                },
                where: {
                    schedule_section_id: student.schedule_section_id,
                    student_section_id: student.student_section_id,
                    subject_id: subjectInfo.subject_id
                }
            }).then(() => secondCB());
        }, callback());
    }, (err) => {
        if (err) {
            next(err);
        }
        res.json({
            status: true,
            message: 'Non exam marks added successfully'
        });
    });
}

module.exports = add;
