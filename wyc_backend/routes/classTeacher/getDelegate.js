const utils = require('../../lib/utils');
const db = require('../../database');
const ClassTeacher = db.models.ClassTeacher;
const Employee = db.models.Employee;
const Section = db.models.Section;
const Class = db.models.Class;

function getDelegate(req, res, next) {
    const today = utils.getToday();
    ClassTeacher.findAll({
        include: [{
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
        },
        {
            required: true,
            attributes: ['id', 'first_name', 'last_name', 'photo'],
            model: Employee,
            as: 'employee'
        }, {
            required: true,
            attributes: ['id', 'first_name', 'last_name', 'photo'],
            model: Employee,
            as: 'delegatedTeacher'
        }],
        where: {
            delegated_to_date: {
                $gte: today
            }
        },
        order: 'delegated_from_date'
    }).then((result) => {
        res.json({
            status: true,
            message: 'Delegated teacher listed successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = getDelegate;
