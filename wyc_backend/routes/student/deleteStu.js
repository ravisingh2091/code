const commonStu = require('../../common/student');

function deleteStu(req, res, next) {
    const student_id = req.query.student_id;
    const stu_sec_id = req.query.stu_sec_id;
    const parent_id = req.query.parent_id;

    commonStu.deleteStu(stu_sec_id, student_id, parent_id).then((data) => {
        if (data) {
            res.json({
                status: true,
                message: 'Student deleted successfully'
            });
        } else {
            res.json({
                status: false,
                message: 'Something went wrong'
            });
        }
    }).catch((err) => {
        next(err);
    });
}

module.exports = deleteStu;
