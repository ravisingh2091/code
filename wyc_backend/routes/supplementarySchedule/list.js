const db = require('../../database'),
    SupplementarySchedule = db.models.SupplementarySchedule,
    ScheduleExam = db.models.ScheduleExam,
    PatternExam = db.models.PatternExam,
    Exam = db.models.Exam,
    StudentSection = db.models.StudentSection,
    Student = db.models.Student,
    Subject = db.models.Subject,
    Section = db.models.Section,
    Class = db.models.Class;

function list(req, res, next) {
    const whereCondition = {};

    if (req.query.student_section_id) {
        whereCondition.student_section_id = req.query.student_section_id;
    }

    if (req.query.schedule_exam_id) {
        whereCondition.schedule_exam_id = req.query.schedule_exam_id;
    }

    if (req.query.session_id) {
        whereCondition['$scheduleExam.session_id$'] = req.query.session_id;
    }

    SupplementarySchedule.findAll({
        include: [{
            required: true,
            attributes: ['id', 'publish_date', 'status'],
            model: ScheduleExam,
            as: 'scheduleExam',
            include: [{
                required: true,
                attributes: ['id', 'no_of_test', 'max_mark', 'pass_percentage', 'weightage'],
                model: PatternExam,
                as: 'patternExam',
                include: [{
                    required: true,
                    attributes: ['id', 'name'],
                    model: Exam,
                    as: 'exam'
                }]
            }]
        }, {
            required: true,
            attributes: ['id', 'roll_no'],
            model: StudentSection,
            as: 'studentSection',
            include: [{
                required: true,
                attributes: ['id', 'first_name', 'last_name'],
                model: Student,
                as: 'student'
            }, {
                required: true,
                attributes: ['id', 'name'],
                model: Section,
                as: 'section',
                include: [{
                    required: true,
                    attributes: ['id', 'name'],
                    model: Class,
                    as: 'class'
                }]
            }]
        }, {
            required: true,
            attributes: ['id', 'name'],
            model: Subject,
            as: 'subject'
        }],
        where: whereCondition

    }).then((data) => {
        res.json({
            status: true,
            message: 'Schedule supplementry exam listed successfully',
            data
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = list;
