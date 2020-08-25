const db = require('../../database');
const FeeCarryForward = db.models.FeeCarryForward;
const StudentSection = db.models.StudentSection;
const Student = db.models.Student;
const Session = db.models.Session;
const Section = db.models.Section;
const Class = db.models.Class;

function list(req, res, next) {
    FeeCarryForward.findAll({
        attributes: ['id', 'date', 'amount', 'status'],
        include: [{
            required: true,
            attributes: ['id'],
            model: StudentSection,
            as: 'studentSection',
            include: [{
                required: true,
                attributes: ['id', 'first_name', 'last_name'],
                model: Student,
                as: 'student',
            }, {
                required: true,
                attributes: ['id', 'name'],
                model: Section,
                as: 'section',
                include: [{
                    required: true,
                    attributes: ['id', 'name'],
                    model: Class,
                    as: 'class',
                }]
            }, {
                required: true,
                attributes: [],
                model: Session,
                as: 'session',
            }]
        }],
        where: { '$studentSection.session.branch_id$': req.query.branch_id }
    }).then((result) => {
        res.json({
            status: true,
            message: 'Student Fee Carry forward listed successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = list;
