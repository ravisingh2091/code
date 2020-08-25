const utils = require('../../lib/utils');
const db = require('../../database');
const Homework = db.models.Homework;
const Section = db.models.Section;
const Class = db.models.Class;
const Subject = db.models.Subject;

function teacherHomework(req, res, next) {
    const date = new Date();
    Homework.findAll({
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
        }, {
            required: true,
            attributes: ['id', 'name'],
            model: Subject,
            as: 'subject'
        }],
        where: {
            created_by: req.query.employee_id,
            session_id: req.query.session_id,
            start_date: {
                $gte: utils.formatDate(date.setDate(date.getDate() - 15))
            }
        },
        order: 'id DESC'
    }).then((result) => {
        res.json({
            status: true,
            message: 'Teacher homework listed successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = teacherHomework;
