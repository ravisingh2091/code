const db = require('../../database');
const ClassTeacher = db.models.ClassTeacher;
const Section = db.models.Section;
const Class = db.models.Class;
const Stream = db.models.Stream;
const Board = db.models.Board;
const Employee = db.models.Employee;

function get(req, res, next) {
    const whereCondition = {};
    if (req.query.id) {
        whereCondition.id = req.query.id;
    }

    if (req.query.section_id && req.query.session_id) {
        whereCondition.section_id = req.query.section_id;
        whereCondition.session_id = req.query.session_id;
    }

    ClassTeacher.findOne({
        attributes: ['id'],
        include: [{
            required: true,
            attributes: ['id', 'name', 'room_no'],
            model: Section,
            as: 'section',
            include: [{
                required: true,
                attributes: ['id', 'name'],
                model: Class,
                as: 'class',
            }]
        }, {
            attributes: ['id', 'first_name', 'last_name'],
            model: Employee,
            as: 'employee'
        }, {
            attributes: ['id', 'name'],
            model: Stream,
            as: 'stream'
        }, {
            attributes: ['id', 'name'],
            model: Board,
            as: 'board'
        }],
        where: whereCondition
    }).then((result) => {
        res.json({
            status: true,
            message: 'class teacher info get succssfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = get;
