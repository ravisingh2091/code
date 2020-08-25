const db = require('../../database');
const Stream = db.models.Stream;
const ClassTeacher = db.models.ClassTeacher;

function del(req, res, next) {
    const stream_id = req.params.id;
    ClassTeacher.findOne({ where: { stream_id } }).then((stream) => {
        if (!stream) {
            return Stream.destroy({ where: { id: stream_id } }).then(() => {
                res.json({
                    status: true,
                    message: 'Stream deleted successfully'
                });
            });
        }
        res.json({
            status: false,
            message: 'Stream is assigned. So we cannot delete stream'
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = del;
