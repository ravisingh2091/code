const async = require('async');
const pushNotification = require('../../common/pushNotification');
const db = require('../../database');
const NoticeBoard = db.models.NoticeBoard;
const NoticeRecipient = db.models.NoticeRecipient;

function add(req, res, next) {
    const data = req.body;
    const sectionInfo = data.section;

    // admin -> parent (Notice) && teacher -> parent (Notification)
    let alert_type = 'Notification';
    if (data.alert_type === 'Notice') {
        alert_type = 'Notice';
    }

    NoticeBoard.create({
        session_id: data.session_id,
        title: data.title,
        description: data.description,
        sender_id: req.query.employee_id,
        recipient_type: data.type
    }).then((notice) => {
        if (data.type === 'Employee') {
            return pushNotification.employeePush('Notice', data.title, req.query.branch_id).then(() => {
                res.json({
                    status: true,
                    message: 'Notice created successfully'
                });
            });
        }
        return async.each(sectionInfo, (section, callback) => {
            NoticeRecipient.create({ section_id: section, notice_id: notice.id }).then(() => {
                pushNotification.studentPush(alert_type, data.title, section)
                    .then(() => callback())
                    .catch(() => callback());
            });
        }, (err) => {
            if (err) {
                return next(err);
            }
            res.json(201, {
                status: true,
                message: 'Notice created for selected section'
            });
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = add;
