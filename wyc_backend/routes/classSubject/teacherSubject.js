const db = require('../../database'),
    ClassSubject = db.models.ClassSubject,
    Subject = db.models.Subject;

function get(req, res, next) {
    const teacher_id = req.query.employee_id,
        sectionId = req.params.sectionId;

    ClassSubject.findAll({
        attributes: ['id', 'exam_status'],
        include: [
            {
                required: true,
                attributes: ['id', 'name'],
                model: Subject,
                as: 'subject'
            }],
        where: {
            teacher_id: teacher_id,
            section_id: sectionId
        }
    }).then((data) => {
        const subjectList = [];
        data.forEach((teacherSubject) => {
            teacherSubject = teacherSubject.get();
            subjectList.push({
                name: teacherSubject.subject.name,
                id: teacherSubject.subject.id
                
            });
        });
        res.json(200, {
            status: true,
            message: 'Teacher subject listed successfully',
            data: subjectList
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = get;
