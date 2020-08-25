const db = require('../../database');
const NoticeBoard = db.models.NoticeBoard;

function update(req, res, next) {
    const data = req.body;
    NoticeBoard.update({ title: data.title, description: data.description }, { where: { id: data.id } }).then(() => {
        res.json({
            status: true,
            message: 'Notice updated successfully'
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = update;
