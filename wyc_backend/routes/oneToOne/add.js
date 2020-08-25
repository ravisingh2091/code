const db = require('../../database');
const message = require('../../common/message');
const pushNotification = require('../../common/pushNotification');
const OneToOne = db.models.OneToOne;

function add(req, res, next) {
    const data = req.body;

    OneToOne.create({
        session_id: data.session_id,
        title: data.title,
        description: data.content,
        type: data.type,
        recipient: data.recipient,
        recipient_type: data.recipient_type
    }).then(() => {
        if (data.recipient_type === 'Employee') {
            if (data.type === 'SMS') {
                return message.employeeMessage(data.recipient, data.content).then(() => {
                    res.json({
                        status: true,
                        message: 'Message sent successfully'
                    });
                });
            }

            return pushNotification.singleEmployeePush(data.type, data.title, data.recipient).then(() => {
                res.json({
                    status: true,
                    message: 'Notice sent successfully'
                });
            });
        } else {
            if (data.type === 'SMS') {
                return message.studentMessage(req.query.branch_id, data.recipient, data.content).then(() => {
                    res.json({
                        status: true,
                        message: 'Message sent successfully'
                    });
                });
            }
            return pushNotification.singleStudentPush(data.title, data.content,data.recipient,data.type).then(() => {
                res.json({
                    status: true,
                    message: 'Notice sent successfully'
                });
            });
        }
    }).catch((err) => {
        next(err);
    });
}

module.exports = add;
