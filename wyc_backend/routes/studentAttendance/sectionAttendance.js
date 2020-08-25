const utils = require('../../lib/utils');
const db = require('../../database');
const StudentAttendance = db.models.StudentAttendance;
const StudentSection = db.models.StudentSection;
const Student = db.models.Student;

function get(req, res, next) {
    const sectionId = req.query.section_id;
    const date = utils.formatDate(new Date(req.query.date));

    StudentAttendance.findAll({
        attributes: ['id', 'date', 'status'],
        include: [{
            attributes: ['id', 'section_id', 'roll_no'],
            required: true,
            model: StudentSection,
            as: 'studentSection',
            include: [{
                required: true,
                attributes: ['id', 'first_name', 'last_name', 'photo'],
                model: Student,
                as: 'student'
            }]
        }],
        where: {
            date: date,
            '$studentSection.section_id$': sectionId
        },
        order: 'studentSection.roll_no'
    }).then((result) => {
        res.json(200, {
            status: true,
            message: 'section attendance listed successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = get;
