const db = require('../../database');
const ClassTeacher = db.models.ClassTeacher;
const Section = db.models.Section;
const Class = db.models.Class;

function classSection(req, res, next) {
    ClassTeacher.findAll({
        attributes: ['id'],
        include: [{
            required: true,
            attributes: ['id', 'name', 'room_no'],
            model: Section,
            as: 'section',
            include: [{
                required: true,
                attributes: ['id', 'name', 'sort'],
                model: Class,
                as: 'class',
            }]
        }],
        where: {
            session_id: req.query.session_id
        },
        order: ['section.class.sort', 'section.name']
    }).then((result) => {
        const classSectionArray = [];

        result.forEach(element => {
            if (!classSectionArray.some((row) => { return row.id === element.section.class.id; })) {
                classSectionArray.push({
                    id: element.section.class.id,
                    name: element.section.class.name,
                    sort: element.section.class.sort,
                    sectionInfo: [{
                        id: element.section.id,
                        name: element.section.name
                    }]
                });
            } else {
                const targetRow = classSectionArray.filter((row) => { return row.id === element.section.class.id; })[0];
                targetRow.sectionInfo.push({
                    id: element.section.id,
                    name: element.section.name
                });
            }
        });

        res.json({
            status: true,
            message: 'Class sections listed successfully',
            data: classSectionArray
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = classSection;
