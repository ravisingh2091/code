const db = require('../../database');
const StudentAttendance = db.models.StudentAttendance;

function get(req, res, next) {
    const studentId = req.params.studentId;

    StudentAttendance.findAll({
        where: {
            student_section_id: studentId
        },
        order: [['date', 'DESC']]
    }).then((result) => {
        res.json(200, {
            status: true,
            message: 'student attendance listed successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = get;
