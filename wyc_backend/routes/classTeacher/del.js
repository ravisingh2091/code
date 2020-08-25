const db = require('../../database');
const ClassTeacher = db.models.ClassTeacher;
const StudentSection = db.models.StudentSection;

function del(req, res, next) {
    StudentSection.find({
        where: {
            section_id: req.query.section_id,
            session_id: req.query.session_id
        }
    }).then((studentList) => {
        if (!studentList) {
            return ClassTeacher.destroy({ where: { id: req.query.id } }).then(() => {
                res.json({
                    status: true,
                    message: 'section deleted successfully'
                });
            });
        }
        res.json({
            status: false,
            message: 'Selected section have students, so we cannot delete section'
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = del;
