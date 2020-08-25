const db = require('../../database');
const ClassTeacher = db.models.ClassTeacher;
const Employee = db.models.Employee;
const Session = db.models.Session;

function sectionTeacher(req, res, next) {
    ClassTeacher.findOne({
        include: [{
            required: true,
            model: Employee,
            as: 'employee'
        }, {
            required: true,
            model: Session,
            as: 'session'
        }],
        where: {
            section_id: req.params.section_id,
            '$session.status$': 'Present'
        }
    })
        .then((classTeacher) => {
            res.json({
                status: true,
                message: 'Class teacher info get successfully',
                classTeacher: classTeacher.employee
            });
        }).catch((err) => {
            next(err);
        });
}

module.exports = sectionTeacher;
