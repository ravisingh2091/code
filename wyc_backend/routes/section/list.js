const db = require('../../database');
const ClassTeacher = db.models.ClassTeacher;
const Section = db.models.Section;

function list(req, res, next) {
    ClassTeacher.findAll({
        attributes: ['id', 'teacher_id', 'board_id', 'stream_id'],
        include: [{
            required: true,
            attributes: ['id', 'name', 'status'],
            model: Section,
            as: 'section'
        }],
        where: {
            '$section.class_id$': req.query.class_id,
            session_id: req.query.session_id
        }
    }).then((result) => {
        res.json({
            status: true,
            message: 'section listed successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = list;
