const db = require('../../database'),
    NonExamMark = db.models.NonExamMark,
    StudentSection = db.models.StudentSection,
    Student = db.models.Student,
    Section = db.models.Section,
    Class = db.models.Class,
    Subject = db.models.Subject;

function get(req, res, next) {
    NonExamMark.findOne({
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
        where: { id: req.query.id }
    }).then((data) => {
        res.json({
            status: true,
            message: 'Non exam mark info get succeessfully',
            data
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = get;
