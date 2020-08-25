const db = require('../../database');
const NoticeBoard = db.models.NoticeBoard;
const NoticeRecipient = db.models.NoticeRecipient;

function del(req, res, next) {
    const noticeId = req.params.notice_id;
    NoticeRecipient.destroy({ where: { notice_id: noticeId } }).then(() => {
        return NoticeBoard.destroy({ where: { id: noticeId } }).then(() => {
            res.json({
                status: true,
                message: 'Notice deleted successfully'
            });
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = del;
