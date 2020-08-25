const utils = require('../../lib/utils');
const db = require('../../database');
const ClassTeacher = db.models.ClassTeacher;
const Section = db.models.Section;
const Class = db.models.Class;
const Session = db.models.Session;

function getClass(req, res, next) {
    const teacher_id = req.query.employee_id;
    const today = utils.getToday();

    ClassTeacher.findAll({
        attributes: ['id', 'section_id', 'teacher_id', 'delegated_teacher_id', 'delegated_from_date', 'delegated_to_date'],
        include: [{
            required: true,
            attributes: ['id', 'name', 'room_no'],
            model: Section,
            as: 'section',
            include: [
                {
                    required: true,
                    attributes: ['id', 'name'],
                    model: Class,
                    as: 'class'
                }
            ]
        }, {
            required: true,
            attributes: [],
            model: Session,
            as: 'session'
        }],
        where: {
            $or: [
                {
                    teacher_id: teacher_id,
                    $or: [{
                        $not: {
                            delegated_from_date: {
                                $lte: today
                            },
                            delegated_to_date: {
                                $gte: today
                            }
                        }
                    }, {
                        delegated_from_date: null,
                        delegated_to_date: null
                    }]
                },
                {
                    delegated_teacher_id: teacher_id,
                    delegated_from_date: {
                        $lte: today
                    },
                    delegated_to_date: {
                        $gte: today
                    }
                }],
            '$session.branch_id$': req.query.branch_id,
            '$session.status$': 'Present'
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
