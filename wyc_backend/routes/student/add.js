const message = require('../../common/message'),
    pushNotification = require('../../common/pushNotification'),
    commonSchool = require('../../common/school'),
    commonStudent = require('../../common/student');

function add(req, res, next) {
    const branch_id = req.query.branch_id;
    const data = req.body;

    commonStudent.getStuRegNo(req.query.branch_id).then((reg_no) => {
        if (reg_no > 0) {
            return commonStudent.parentExist(data.contact_no).then((parent) => {
                if (!parent) {
                    return commonStudent.addParent(data).then((newParent) => {
                        return commonStudent.addStudent(data, newParent.id, reg_no).then((newStudent) => {
                            return commonStudent.getStuRollNo(data.section_id, data.session_id).then((rollInfo) => {
                                return commonStudent.addStudentSection(data, newStudent.id, rollInfo).then((stuSection) => {
                                    return commonSchool.addUser(data, newParent.id, 'Parent').then(() => {
                                        message.welcomeMessage(data.contact_no, branch_id);
                                        res.json({
                                            status: true,
                                            message: 'Student & Parent info added successfully',
                                            data: {
                                                id: newStudent.id,
                                                stu_section_id: stuSection.id
                                            }
                                        });
                                    });
                                });
                            });
                        });
                    });
                } else {
                    return commonStudent.updateParent(data, parent.id).then(() => {
                        return commonStudent.addStudent(data, parent.id, reg_no).then((newStudent) => {
                            return commonStudent.getStuRollNo(data.section_id, data.session_id).then((rollInfo) => {
                                return commonStudent.addStudentSection(data, newStudent.id, rollInfo).then((stuSection) => {
                                    return commonSchool.updateUser(data.contact_no, parent.id, 'Parent').then(() => {
                                        message.welcomeMessage(data.contact_no, branch_id);
                                        pushNotification.singleParentPush(parent.id);
                                        res.json({
                                            status: true,
                                            message: 'Student info added & Parent info updated successfully',
                                            data: {
                                                id: newStudent.id,
                                                stu_section_id: stuSection.id
                                            }
                                        });
                                    });
                                });
                            });
                        });
                    });
                }
            });
        } else {
            return res.json({
                status: false,
                message: 'Set school start registration number'
            });
        }
    }).catch((err) => {
        next(err);
    });
}

module.exports = add;
