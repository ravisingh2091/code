const db = require('../../database'),
    pushNotification = require('../../common/pushNotification'),
    ClassTeacher = db.models.ClassTeacher;

function deleteDelegate(req, res, next) {
    const data = req.query;
    ClassTeacher.update({
        delegated_teacher_id: null,
        delegated_from_date: null,
        delegated_to_date: null
    }, { where: { id: data.id } }).then(() => {
        const msg = `Attendance delegated to you for ${data.class_sec} has been revoked`;
        pushNotification.singleEmployeePush('Attendance Delegation', msg, data.teacher_id);
        res.json({
            status: true,
            message: 'Delegated info removed successfully'
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = deleteDelegate;
