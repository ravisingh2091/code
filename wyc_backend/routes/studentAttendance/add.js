const async = require('async'),
    db = require('../../database'),
    StudentAttendance = db.models.StudentAttendance,
    pushNotification = require('../../common/pushNotification');

function add(req, res, next) {
    const data = req.body;
    const studentAttendance = data.studentAttendance;

    async.each(studentAttendance, (attendance, callback) => {
        let attendanceStatus = '';
        if (attendance.status === 0) {
            attendanceStatus = 'Absent';
        } else if (attendance.status === 1) {
            attendanceStatus = 'Present';
        } else {
            attendanceStatus = 'Late';
        }
        StudentAttendance.create({
            student_section_id: attendance.student_id,
            date: attendance.date,
            status: attendance.status
        }).then(() => {
            return pushNotification.singleStudentPush('Attendance', attendanceStatus, attendance.student_id)
                .then(() => callback())
                .catch(() => callback());
        });
    }, (err) => {
        if (err) {
            return next(err);
        }
        res.json(201, {
            status: true,
            message: 'Attendance created successfully'
        });
    });
}

module.exports = add;
