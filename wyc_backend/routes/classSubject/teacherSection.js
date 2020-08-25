const db = require('../../database'),
    ClassSubject = db.models.ClassSubject,
    Section = db.models.Section,
    Class = db.models.Class;

function get(req, res, next) {
    const teacher_id = req.query.employee_id,
        classId = req.params.classId;

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
                    attributes: ['id', 'name'],
                    model: Class,
                    as: 'class',
                    where: {
                        id: classId
                    }
                }]
            }
        ],
        where: {
            teacher_id: teacher_id
        },
        order: ['section.name'],
        group: ['section.name']
    }).then((data) => {
        const sectionList = [];
        data.forEach((classSection) => {
            classSection = classSection.get();
            sectionList.push({
                id: classSection.section.id,
                name: classSection.section.name
            });
        });
        res.json(200, {
            status: true,
            message: 'Teacher section listed successfully',
            data: sectionList
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = get;
