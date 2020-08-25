const async = require('async');
const db = require('../../database');
const StudentSection = db.models.StudentSection;
const Student = db.models.Student;
const ClassTeacher = db.models.ClassTeacher;

function generateRollNo(req, res, next) {
    const session_id = req.query.session_id;
    const section_id = req.query.section_id;

    StudentSection.findAll({
        attributes: ['id'],
        include: [{
            attributes: ['first_name', 'last_name'],
            model: Student,
            as: 'student'
        }],
        where: {
            session_id: session_id,
            section_id: section_id
        },
        order: ['student.first_name', 'student.last_name']
    }).then((studentList) => {
        let rollNo = 0;
        return async.each(studentList, (student, callback) => {
            rollNo = rollNo + 1;
            StudentSection.update({ roll_no: rollNo }, { where: { id: student.id } })
                .then(() => callback())
                .catch(() => callback());
        }, (err) => {
            if (err) {
                return next(err);
            }
            res.json(201, {
                status: true,
                message: 'Student roll no. generated successfully'
            });
            // return ClassTeacher.update({ roll_no_flag: 1 }, {
            //     where: {
            //         session_id: session_id,
            //         section_id: section_id
            //     }
            // }).then(() => {
            //     res.json(201, {
            //         status: true,
            //         message: 'Student roll no. generated successfully'
            //     });
            // });
        });
    });
}

module.exports = generateRollNo;
