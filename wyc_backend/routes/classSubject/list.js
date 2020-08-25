const db = require('../../database'),
    ClassSubject = db.models.ClassSubject,
    Subject = db.models.Subject,
    Employee = db.models.Employee;

function get(req, res, next) {
    const whereCondition = {
        section_id: req.query.section_id
    };

    if (req.query.exam_type) {
        whereCondition.exam_status = req.query.exam_type;
    }

    ClassSubject.findAll({
        attributes: ['id', 'section_id', 'exam_status'],
        include: [
            {
                attributes: ['id', 'name'],
                model: Subject,
                as: 'subject'
            },
            {
                attributes: ['id', 'first_name', 'last_name'],
                model: Employee,
                as: 'employee'
            }
        ],
        where: whereCondition
    }).then((result) => {
        res.json({
            status: true,
            message: 'section subject listed successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = get;
