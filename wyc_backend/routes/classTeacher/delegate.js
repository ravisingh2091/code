const utils = require('../../lib/utils'),
    pushNotification = require('../../common/pushNotification'),
    db = require('../../database'),
    ClassTeacher = db.models.ClassTeacher;

function delegate(req, res, next) {
    const data = req.body;
    ClassTeacher.find({
        where: {
            teacher_id: data.teacher_id,
            session_id: data.session_id,
            section_id: data.section_id
        }
    }).then((delegation) => {
        if (!delegation) {
            return ClassTeacher.update({
                delegated_teacher_id: data.teacher_id,
                delegated_from_date: utils.formatDate(new Date(data.from_date)),
                delegated_to_date: utils.formatDate(new Date(data.to_date))
            }, { where: { session_id: data.session_id, section_id: data.section_id } }).then(() => {
                const msg = `you have been delegated to take attendance of ${data.class_name} - ${data.section_name} for the period ${utils.formatDate(data.from_date, 'DD-MMM')} to ${utils.formatDate(data.to_date, 'DD-MMM')}`;
                pushNotification.singleEmployeePush('Attendance Delegation', msg, data.teacher_id);
                res.json({
                    status: true,
                    message: 'Teacher delegated successfully'
                });
            }).catch((err) => {
                next(err);
            });
        }
        return res.json({
            status: false,
            message: 'Delegate teacher cannot be same as class teacher'
        });
    });
}

module.exports = delegate;
