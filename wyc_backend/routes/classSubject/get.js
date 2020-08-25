const db = require('../../database'),
    ClassSubject = db.models.ClassSubject,
    Subject = db.models.Subject,
    Employee = db.models.Employee;

function get(req, res, next) {
    ClassSubject.findOne({
        attributes: ['id', 'section_id', 'exam_status'],
        include: [{
            attributes: ['id', 'name'],
            model: Subject,
            as: 'subject'
        }, {
            attributes: ['id', 'first_name', 'last_name'],
            model: Employee,
            as: 'employee'
        }],
        where: {
            id: req.params.id
        }
    }).then((result) => {
        res.json({
            status: true,
            message: 'subject teacher info get successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = get;
