const db = require('../../database');
const Message = db.models.Message;

function list(req, res, next) {
    Message.findAll({
        where: {
            recipient_type: req.query.recipient,
            session_id: req.query.session_id
        },
        order: 'created_at DESC'
    }).then((result) => {
        res.json({
            status: true,
            message: 'Message Listed successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = list;
