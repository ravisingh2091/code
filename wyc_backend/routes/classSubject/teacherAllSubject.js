const db = require('../../database'),
    ClassSubject = db.models.ClassSubject,
    Subject = db.models.Subject,
    Section = db.models.Section,
    Class = db.models.Class;

function allTeacherSubject(req, res, next) {
    ClassSubject.findAll({
        attributes: ['id'],
        include: [{
            required: true,
            attributes: ['id', 'name'],
            model: Subject,
            as: 'subject'
        }, {
            required: true,
            attributes: ['id', 'name'],
            model: Section,
            as: 'section',
            include: [{
                required: true,
                attributes: ['id', 'name', 'sort'],
                model: Class,
                as: 'class'
            }]
        }],
        where: {
            teacher_id: req.query.teacher_id
        },
        order: ['section.class.sort', 'section.name']
    }).then((result) => {
        const teacherSubjectArray = [];
        result.forEach(element => {
            if (!teacherSubjectArray.some((row) => { return row.section_id === element.section.id; })) {
                teacherSubjectArray.push({
                    class_id: element.section.class.id,
                    class_name: element.section.class.name,
                    section_id: element.section.id,
                    section_name: element.section.name,
                    subjects: [{
                        id: element.subject.id,
                        name: element.subject.name
                    }]
                });
            } else {
                const targetRow = teacherSubjectArray.filter((row) => { return row.section_id === element.section.id; })[0];
                targetRow.subjects.push({
                    id: element.subject.id,
                    name: element.subject.name
                });
            }
        });
        res.json({
            status: true,
            message: 'Class wise teacher subjects listed successfully',
            data: teacherSubjectArray
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = allTeacherSubject;
