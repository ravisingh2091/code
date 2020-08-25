const db = require('../../database');
const Homework = db.models.Homework;
const Subject = db.models.Subject;
const Employee = db.models.Employee;

function list(req, res, next) {
    const sectionId = req.params.sectionId;
    Homework.findAll({
        include: [
            {
                required: true,
                attributes: ['name'],
                model: Subject,
                as: 'subject'
            },
            {
                required: true,
                attributes: ['first_name', 'last_name'],
                model: Employee,
                as: 'employee'
            }],
        where: {
            section_id: sectionId
        },
        order: 'start_date DESC'
    }).then((result) => {
        res.json({
            status: true,
            message: 'homework Listed Successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = list;
