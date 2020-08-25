const db = require('../../database'),
    ClassSubject = db.models.ClassSubject,
    Periods = db.models.Periods;

function del(req, res, next) {
    const class_subject_id = req.params.id;

    Periods.findAll({
        where: { class_subject_id }
    }).then((classSubject) => {
        if (classSubject.length === 0) {
            return ClassSubject.destroy({ where: { id: class_subject_id } }).then(() => {
                res.json({
                    status: true,
                    message: 'Subject removed from section successfully'
                });
            });
        }
        res.json({
            status: false,
            message: 'Subject assign to timetable, so we cannot delete'
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = del;
