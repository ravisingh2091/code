const async = require('async');
const db = require('../../database');
const message = require('../../common/message');
const Message = db.models.Message;
const MessageRecipient = db.models.MessageRecipient;

function add(req, res, next) {
    const data = req.body;
    const sectionInfo = data.section;
    const session_id = data.session_id;

    Message.create({
        session_id: data.session_id,
        message: data.message,
        sender_id: req.query.employee_id,
        recipient_type: data.type
    }).then((messageInfo) => {
        if (data.type === 'Employee') {
            return message.allEmployeeMessage(req.query.branch_id, data.message).then(() => {
                return res.json({
                    status: true,
                    message: 'Message send successfully'
                });
            });
        }
        return async.each(sectionInfo, (section, callback) => {
            MessageRecipient.create({ section_id: section, message_id: messageInfo.id })
                .then(() => {
                    return message.sectionMessage(req.query.branch_id, session_id,section, data.message)
                        .then(() => callback())
                        .catch(() => callback());
                });
        }, (err) => {
            if (err) {
                return next(err);
            }
            res.json(201, {
                status: true,
                message: 'Selected section message send successfully'
            });
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = add;
