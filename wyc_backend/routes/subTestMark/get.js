const db = require('../../database');
const SubTestMark = db.models.SubTestMark;
const StudentSection = db.models.StudentSection;
const Student = db.models.Student;

function get(req, res, next) {
    SubTestMark.findAll({
        attributes: ['id', 'mark', 'status'],
        include: [{
            required: true,
            attributes: ['id', 'roll_no'],
            model: StudentSection,
            as: 'studentSection',
            include: [{
                required: true,
                attributes: ['id', 'admission_no', 'first_name', 'last_name'],
                model: Student,
                as: 'student',
            }]
        }],
        where: {
            schedule_sub_test_info_id: req.query.sub_test_id
        }
    }).then((result) => {
        res.json({
            status: true,
            message: 'Subtest mark listed successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = get;
