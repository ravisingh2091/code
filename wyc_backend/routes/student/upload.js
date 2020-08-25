const async = require('async');
const commonStudent = require('../../common/student');
const commonSchool = require('../../common/school');
const message = require('../../common/message');

function add(req, res, next) {
    const branch_id = req.query.branch_id;
    const data = req.body;
    const students = data.student;

    async.eachSeries(students, function (student, callback) {
        student.session_id = data.session_id;
        student.section_id = data.section_id;
        commonStudent.parentExist(student.contact_no).then((parent) => {
            if (!parent) {
                return commonStudent.addParent(student).then((newParent) => {
                    return commonStudent.addStudent(student, newParent.id).then((newStudent) => {
                        return commonStudent.getStuRollNo(student.section_id, student.session_id).then((rollInfo) => {
                            return commonStudent.addStudentSection(student, newStudent.id, rollInfo).then(() => {
                                return commonSchool.addUser(student, newParent.id, 'Parent').then(() => {
                                    message.welcomeMessage(student.contact_no, branch_id);
                                    callback();
                                });
                            });
                        });
                    });
                });
            } else {
                return commonStudent.updateParent(student, parent.id).then(() => {
                    return commonStudent.addStudent(student, parent.id).then((newStudent) => {
                        return commonStudent.getStuRollNo(student.section_id, student.session_id).then((rollInfo) => {
                            return commonStudent.addStudentSection(student, newStudent.id, rollInfo).then(() => {
                                return commonSchool.updateUser(student.contact_no, parent.id, 'Parent').then(() => {
                                    message.welcomeMessage(student.contact_no, branch_id);
                                    callback();
                                });
                            });
                        });
                    });
                });
            }
        });
    }, function (err) {
        if (err) {
            next(err);
        }
        res.json({
            status: true,
            message: 'Students uploaded successfully'
        });
    });
}

module.exports = add;
