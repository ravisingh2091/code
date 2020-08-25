const utils = require('../../lib/utils');
const db = require('../../database');
const Homework = db.models.Homework;
const Subject = db.models.Subject;
const Employee = db.models.Employee;
const Section = db.models.Section;
const Class = db.models.Class;

function sectionHomework(req, res, next) {
    const whereCondition = {};

    if (req.query.section_id) {
        whereCondition.start_date = utils.formatDate(new Date(req.query.date));
        whereCondition.section_id = req.query.section_id;
    }

    if (req.query.session_id) {
        whereCondition.start_date = utils.getToday();
        whereCondition.session_id = req.query.session_id;
    }

    Homework.findAll({
        include: [{
            required: true,
            attributes: ['id', 'name'],
            model: Subject,
            as: 'subject'
        },
        {
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
        },
        {
            required: true,
            attributes: ['id', 'first_name', 'last_name'],
            model: Employee,
            as: 'employee'
        }],
        where: whereCondition
    }).then((result) => {
        res.json({
            status: true,
            message: 'Section homework listed successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = sectionHomework;
