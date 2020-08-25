const db = require('../../database');
const Subject = db.models.Subject;
const ClassSubject = db.models.ClassSubject;

function del(req, res, next) {
    const subject_id = req.params.id;
    ClassSubject.findOne({ where: { subject_id } }).then((subject) => {
        if (!subject) {
            return Subject.destroy({ where: { id: subject_id } }).then(() => {
                res.json({
                    status: true,
                    message: 'Subject deleted successfully'
                });
            });
        }
        res.json({
            status: false,
            message: 'Subject is assigned. So we cannot delete subject'
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = del;
