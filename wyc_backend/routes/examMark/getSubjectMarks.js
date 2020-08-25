const db = require('../../database');
const ExamMarkInfo = db.models.ExamMarkInfo;
const ExamMark = db.models.ExamMark;
const StudentSection = db.models.StudentSection;
const Student = db.models.Student;
const Subject = db.models.Subject;

function getSubjectMarks(req, res, next) {
    ExamMarkInfo.findAll({
        attributes: ['id', 'mark', 'status'],
        include: [{
            requried: true,
            attributes: ['id'],
            model: ExamMark,
            as: 'examMark',
            include: [{
                requried: true,
                attributes: ['id', 'roll_no'],
                model: StudentSection,
                as: 'studentSection',
                include: [{
                    requried: true,
                    attributes: ['id', 'first_name', 'last_name', 'admission_no'],
                    model: Student,
                    as: 'student'
                }]
            }]
        }, {
            requried: true,
            attributes: ['id', 'name'],
            model: Subject,
            as: 'subject'
        }],
        where: {
            '$examMark.schedule_exam_id$': req.query.schedule_exam_id,
            subject_id: req.query.subject_id
        }
    }).then((result) => {
        res.json({
            status: true,
            message: 'Exam subject mark listed successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = getSubjectMarks;
