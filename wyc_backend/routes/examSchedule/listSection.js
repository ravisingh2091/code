const db = require('../../database');
const ScheduleSection = db.models.ScheduleSection;
const Section = db.models.Section;
const Class = db.models.Class;

function listSection(req, res, next) {
    const whereCondition = {
        session_id: req.query.session_id
    };

    if (req.query.status) {
        const status = req.query.status;
        const statusArr = status.split(',');
        if (statusArr.length > 1) {
            whereCondition.status = {
                $in: statusArr
            };
        } else {
            whereCondition.status = status;
        }
    }

    if (req.query.section_id) {
        whereCondition.section_id = req.query.section_id;
    }
    ScheduleSection.findAll({
        attributes: ['id', 'publish_date', 'status'],
        include: [{
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
        }],
        where: whereCondition
    }).then((result) => {
        res.json({
            status: true,
            message: 'Section listed successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = listSection;
