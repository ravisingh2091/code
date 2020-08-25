 const db = require('../../database');
const ExamSection = db.models.ExamSection;
const Section = db.models.Section;
const Class = db.models.Class;
const Pattern = db.models.Pattern;

function get(req, res, next) {
    const whereCondition = {
        session_id: req.query.session_id
    };

    if (req.query.pattern_id) {
        whereCondition.pattern_id = req.query.pattern_id;
    }
    ExamSection.findAll({
        attributes: ['id','non_exam_point'],
        include: [{
            required: true,
            attributes: ['id', 'name'],
            model: Pattern,
            as: 'pattern'
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
        where: whereCondition,
        order: ['section.class.sort']
    }).then((result) => {
        res.json({
            status: true,
            message: 'Exam section listed successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = get;
