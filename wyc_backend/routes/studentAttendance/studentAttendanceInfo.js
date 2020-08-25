const db = require('../../database');
const StudentAttendance = db.models.StudentAttendance;

function studentAttendancePercentage(req, res, next) {
    const student_id = req.query.student_id;
    Promise.all([
        StudentAttendance.count({ where: { student_section_id: student_id } }),
        StudentAttendance.count({ where: { student_section_id: student_id, status: 1 } })])
        .then(([total, present]) => {
            res.json({
                status: true,
                message: 'student attendance info get successfully',
                data: {
                    total: total,
                    present: present,
                    absent: total - present,
                    percentage: present * 100 / total
                }
            });
        }).catch((err) => {
            next(err);
        });
}

module.exports = studentAttendancePercentage;
