const db = require('../../database'),
    ClassSubject = db.models.ClassSubject;

function update(req, res, next) {
    const data = req.body;

    ClassSubject.find({
        where: {
            section_id: data.section_id,
            subject_id: data.subject_id,
            $not: {
                id: data.id
            }
        }
    }).then((classSubject) => {
        if (!classSubject) {
            return ClassSubject.update({
                subject_id: data.subject_id,
                teacher_id: data.teacher_id,
                exam_status: data.exam_status
            }, { where: { id: data.id } }).then(() => {
                res.json({
                    status: true,
                    message: 'Subject updated successfully'
                });
            });
        }
        res.json({
            status: false,
            message: 'Subject already exist in this section'
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = update;
