const db = require('../../database'),
    ClassSubject = db.models.ClassSubject,
    Section = db.models.Section,
    Class = db.models.Class;

function get(req, res, next) {
    const teacher_id = req.query.employee_id;

    ClassSubject.findAll({
        attributes: ['id', 'exam_status'],
        include: [
            {
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
            }
        ],
        where: {
            teacher_id: teacher_id
        },
        order: ['section.class.sort'],
        group: ['section.class.name']
    }).then((data) => {
        const classArray = [];
        data.forEach((classes) => {
            classes = classes.get();
            classArray.push({
                id: classes.section.class.id,
                name: classes.section.class.name,
                sort: classes.section.class.sort
            });
        });
        res.json({
            status: true,
            message: 'Teacher class listed successfully',
            data: classArray
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = get;
