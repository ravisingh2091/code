const async = require('async'),
    db = require('../../database'),
    pushNotification = require('../../common/pushNotification');

const StudentAttendance = db.models.StudentAttendance;

function update(req, res, next) {
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
        StudentAttendance.update({ status: attendance.status }, { where: { id: attendance.id } }).then(() => {
            return pushNotification.singleStudentPush('Attendance', attendanceStatus, attendance.student_id).then(() => callback());
        });
    }, (err) => {
        if (err) {
            return next(err);
        }
        res.json({
            status: true,
            message: 'Attendance updated successfully'
        });
    });
}

module.exports = update;
