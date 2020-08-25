const db = require('../../database'),
    NonExamMark = db.models.NonExamMark,
    StudentSection = db.models.StudentSection,
    Student = db.models.Student,
    Section = db.models.Section,
    Class = db.models.Class,
    Subject = db.models.Subject;

function list(req, res, next) {
    const whereCondition = {};
    if (req.query.student_section_id) {
        whereCondition.student_section_id = req.query.student_section_id;
    }

    if (req.query.schedule_section_id) {
        whereCondition.schedule_section_id = req.query.schedule_section_id;
    }

    NonExamMark.findAll({
        include: [{
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
            message: 'Non exam mark listed successfully',
            data
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = list;
