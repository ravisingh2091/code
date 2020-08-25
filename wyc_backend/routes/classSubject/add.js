const async = require('async'),
    db = require('../../database'),
    ClassSubject = db.models.ClassSubject,
    Subject = db.models.Subject;

function add(req, res, next) {
    const subjectList = req.body.options;
    const existSubjects = [];

    async.each(subjectList, (list, cb) => {
        ClassSubject.find({
            where: {
                section_id: req.body.section_id,
                subject_id: list.subject_id
            }
        }).then((subject) => {
            if (subject) {
                existSubjects.push(list.subject_id);
            }
            cb();
        });
    }, (err) => {
        if (err) {
            return next(err);
        }
        if (existSubjects.length === 0) {
            return async.each(subjectList, (subjectList, callback) => {
                ClassSubject.create({
                    section_id: req.body.section_id,
                    subject_id: subjectList.subject_id,
                    teacher_id: subjectList.teacher_id,
                    exam_status: subjectList.exam_status
                }).then(() => callback())
                    .catch(() => callback());
            }, (error) => {
                if (error) {
                    return next(error);
                }
                return res.json({
                    status: true,
                    message: 'selected subject assigned successfully'
                });
            });
        } else {
            Subject.findById(existSubjects[0]).then((subjectInfo) => {
                return res.json({
                    status: false,
                    message: subjectInfo.name + ' already exist in this section'
                });
            });
        }
    });
}

module.exports = add;
