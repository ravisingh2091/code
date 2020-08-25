const db = require('../../database');
const ClassTeacher = db.models.ClassTeacher;
const Section = db.models.Section;
const Class = db.models.Class;
const Employee = db.models.Employee;
const Board = db.models.Board;
const Stream = db.models.Stream;


function getClass(req, res, next) {
    ClassTeacher.findAll({
        attributes: ['id', 'roll_no_flag', 'session_id', 'section_id'],
        include: [
            {
                required: true,
                attributes: ['id', 'name', 'room_no'],
                model: Section,
                as: 'section',
                include: [{
                    required: true,
                    attributes: ['id', 'name'],
                    model: Class,
                    as: 'class'
                }]
            }, {
                attributes: ['id', 'first_name', 'last_name'],
                model: Employee,
                as: 'employee'
            },
            {
                attributes: ['id', 'name'],
                model: Stream,
                as: 'stream'
            },
            {
                attributes: ['id', 'name'],
                model: Board,
                as: 'board'
            }],
        where: {
            'session_id': req.query.session_id
        },
        order: ['section.class.sort']
    }).then((result) => {
        res.json(200, {
            status: true,
            message: 'Teacher class listed successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = getClass;
