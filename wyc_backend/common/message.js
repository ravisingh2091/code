'use strict';
global.a=0;
const utils = require('../lib/utils'),
    request = require('request-promise'),
    db = require('../database'),
    Session = db.models.Session,
    StudentSection = db.models.StudentSection,
    Student = db.models.Student,
    Parent = db.models.Parent,
    Employee = db.models.Employee,
    Branch = db.models.Branch,
    defaultSender = 'WYCHLD',
    commonUrl = 'http://bhashsms.com/api/sendmsg.php?user=aloksingh123&pass=123456&priority=ndnd&stype=normal&',
    // sender=Sender ID&phone=Mobile No&text=Test SMS

    message = {
        /**
         * Common message
         * @param url
         * @returns {*}
         */
        msgSender: (url) => {
            const finalURL = encodeURI(url);
            return request(finalURL).then(() => {
                return true;
            });
        },

        /**
         * Reset password message
         * @param mobile_no
         * @param msg
         * @returns {*}
         */
        resetPassword: (mobile_no, msg, user_id, type) => {
            if (type === 'Employee') {
                return Employee.findOne({
                    include: [{
                        required: true,
                        attributes: ['id', 'sender_id', 'remaining_msg', 'msg_session_count', 'msg_date_count', 'msg_date'],
                        model: Branch,
                        as: 'branch'
                    }],
                    where: { id: user_id }
                }).then((empBranchInfo) => {
                    const remining = parseInt(empBranchInfo.branch.remaining_msg) - 1,
                        date_count = utils.getToday() === utils.formatDate(empBranchInfo.branch.msg_date) ? parseInt(empBranchInfo.branch.msg_date_count) + 1 : 1,
                        total = parseInt(empBranchInfo.branch.msg_session_count) + 1,
                        url = commonUrl + 'sender=' + empBranchInfo.branch.sender_id + '&phone=' + mobile_no + '&text=' + msg;

                    return message.updateCounter(empBranchInfo.branch.id, remining, total, date_count).then(() => {
                        return message.msgSender(url).then(() => {
                            return true;
                        });
                    });
                });
            } else {
                return StudentSection.findOne({
                    attributes: ['id'],
                    include: [{
                        required: true,
                        attributes: [],
                        model: Student,
                        as: 'student'
                    }, {
                        required: true,
                        attributes: ['id'],
                        model: Session,
                        as: 'session',
                        include: [{
                            required: true,
                            attributes: ['id', 'sender_id', 'remaining_msg', 'msg_session_count', 'msg_date_count', 'msg_date'],
                            model: Branch,
                            as: 'branch'
                        }]
                    }],
                    where: {
                        '$student.parent_id$': user_id
                    }
                }).then((stuBranchInfo) => {
                    const remining = parseInt(stuBranchInfo.session.branch.remaining_msg) - 1,
                        date_count = utils.getToday() === utils.formatDate(stuBranchInfo.session.branch.msg_date) ? parseInt(stuBranchInfo.session.branch.msg_date_count) + 1 : 1,
                        total = parseInt(stuBranchInfo.session.branch.msg_session_count) + 1,
                        url = commonUrl + 'sender=' + stuBranchInfo.session.branch.sender_id + '&phone=' + mobile_no + '&text=' + msg;

                    return message.updateCounter(stuBranchInfo.session.branch.id, remining, total, date_count).then(() => {
                        return message.msgSender(url).then(() => {
                            return true;
                        });
                    });
                });
            }
        },

        /**
         * Welcome message
         * @param branch_id
         * @param mobile
         * @param msg
         * @returns {*}
         */
        welcomeMessage: (mobile, branch_id = '') => {
            const content = 'Welcome to Way your Child ' + 'username: ' + mobile + ', password:' + mobile;
            if (branch_id !== '') {
                return message.getBranchMsgInfo(branch_id).then((branchInfo) => {
                    const remining = parseInt(branchInfo.remaining_msg) - 1,
                        date_count = utils.getToday() === utils.formatDate(branchInfo.msg_date) ? parseInt(branchInfo.msg_date_count) + 1 : 1,
                        total = parseInt(branchInfo.msg_session_count) + 1,
                        url = `${commonUrl}sender=${branchInfo.sender_id}&phone=${mobile}&text=${content}`;
                    return message.updateCounter(branch_id, remining, total, date_count).then(() => {
                        return message.msgSender(url).then(() => {
                            return true;
                        });
                    });
                });
            } else {
                const url = commonUrl + 'sender=' + defaultSender + '&phone=' + mobile + '&text=' + content;
                return message.msgSender(url).then(() => {
                    return true;
                });
            }
        },

        /**
         * Student message
         * @param branch_id
         * @param student_id
         * @param content
         * @returns {*}
         */
        studentMessage: (branch_id, student_id, content) => {
            return StudentSection.findOne({
                include: [{
                    attributes: ['id'],
                    model: Student,
                    as: 'student',
                    include: [{
                        attributes: ['contact_no'],
                        model: Parent,
                        as: 'parent'
                    }]
                }],
                where: {
                    id: student_id,
                    status: 'STUDYING'
                }
            }).then((studentInfo) => {
                return message.getBranchMsgInfo(branch_id).then((branchInfo) => {
                    if (branchInfo.remaining_msg > 0) {
                        const remining = parseInt(branchInfo.remaining_msg) - 1,
                            date_count = utils.getToday() === utils.formatDate(branchInfo.msg_date) ? parseInt(branchInfo.msg_date_count) + 1 : 1,
                            total = parseInt(branchInfo.msg_session_count) + 1,
                            url = `${commonUrl}sender=${branchInfo.sender_id}&phone=${studentInfo.student.parent.contact_no}&text=${content}`;
                        return message.updateCounter(branch_id, remining, total, date_count).then(() => {
                            return message.msgSender(url).then(() => {
                                return true;
                            });
                        });
                    } else {
                        return true;
                    }
                });
            });
        },

        /**
         * Section student message
         * @param branch_id
         * @param section_id
         * @param content
         * @returns {*}
         */
        sectionMessage: (branch_id,session_id, section_id, content) => {
            return StudentSection.findAll({
                attributes: ['id', 'section_id'],
                include: [{
                    attributes: ['id'],
                    model: Student,
                    as: 'student',
                    include: [{
                        attributes: ['id', 'contact_no'],
                        model: Parent,
                        as: 'parent'
                    }]
                }],
                where: {
                    session_id:session_id,
                    section_id: section_id,
                    status: 'STUDYING'
                }
            }).then((studentInfo) => {
                if (studentInfo) {
                    const contactNo = [];
                    studentInfo.forEach((student) => {
                        contactNo.push(student.student.parent.contact_no);
                    });
                    console.log(contactNo)
                    global.a += contactNo.length;
                    return message.getBranchMsgInfo(branch_id).then((branchInfo) => {
                        if (branchInfo.remaining_msg > 0) {
                          // var remining = parseInt(branchInfo.remaining_msg) - contactNo.length,
                        var remining = parseInt(branchInfo.remaining_msg) -  global.a,


                                date_count = utils.getToday() === utils.formatDate(branchInfo.msg_date) ? parseInt(branchInfo.msg_date_count) + global.a : global.a,
                               // total = parseInt(branchInfo.msg_session_count) + contactNo.length,
                               total = parseInt(branchInfo.msg_session_count) + global.a,
                                url = commonUrl + 'sender=' + branchInfo.sender_id + '&phone=' + contactNo.toString() + '&text=' + content;
                            console.log(url)
                            console.log(remining)
                            return message.updateCounter(branch_id, remining, total, date_count).then(() => {
                                console.log(date_count)
                                return message.msgSender(url).then(() => {
                                  global.a=0;
                                    return true;
                                });
                            });
                        } else {
                            return true;
                        }
                    });
                }
                return true;
            });
        },

        /**
       * Employee message
       * @param employee_id
       * @param message
       * @returns {*}
       */
        employeeMessage: (employee_id, content) => {
            return Employee.findOne({
                attributes: ['id', 'contact_no'],
                include: [{
                    required: true,
                    attributes: ['id', 'sender_id', 'remaining_msg', 'msg_session_count', 'msg_date_count', 'msg_date'],
                    model: Branch,
                    as: 'branch'
                }],
                where: {
                    id: employee_id,
                    status: 1
                }
            }).then((empInfo) => {
                if (empInfo.branch.remaining_msg > 0) {
                    const remining = parseInt(empInfo.branch.remaining_msg) - 1,
                        date_count = utils.getToday() === utils.formatDate(empInfo.branch.msg_date) ? parseInt(empInfo.branch.msg_date_count) + 1 : 1,
                        total = parseInt(empInfo.branch.msg_session_count) + 1,
                        url = commonUrl + 'sender=' + empInfo.branch.sender_id + '&phone=' + empInfo.contact_no + '&text=' + content;

                    return message.msgSender(url).then(() => {
                        return message.updateCounter(empInfo.branch.id, remining, total, date_count).then(() => {
                            return true;
                        });
                    });
                } else {
                    return true;
                }
            });
        },

        /**
         * All employee message
         * @param branch_id
         * @param message
         * @returns {*}
         */
        allEmployeeMessage: (branch_id, content) => {
            return Employee.findAll({
                attributes: ['id', 'contact_no'],
                where: {
                    branch_id: branch_id,
                    type_id: 4,
                    status: 1
                }
            }).then((empInfo) => {
                const contactNo = [];
                empInfo.forEach((emp) => {
                    contactNo.push(emp.contact_no);
                });
                return message.getBranchMsgInfo(branch_id).then((branchInfo) => {
                    if (branchInfo.remaining_msg > 0) {
                        const remining = parseInt(branchInfo.remaining_msg) - contactNo.length,
                            date_count = utils.getToday() === utils.formatDate(branchInfo.msg_date) ? parseInt(branchInfo.msg_date_count) + contactNo.length : contactNo.length,
                            total = parseInt(branchInfo.msg_session_count) + contactNo.length,
                            url = commonUrl + 'sender=' + branchInfo.sender_id + '&phone=' + contactNo.toString() + '&text=' + content;

                        return message.updateCounter(branch_id, remining, total, date_count).then(() => {
                            return message.msgSender(url).then(() => {
                                return true;
                            });
                        });
                    } else {
                        return true;
                    }
                });
            });
        },

        /**
         * Update message counter
         * @param id
         * @param remaining_msg
         * @param msg_session_count
         * @param msg_date_count
         * @returns {*}
         */
        updateCounter: (id, remaining_msg, msg_session_count, msg_date_count) => {
            return Branch.update({
                remaining_msg,
                msg_session_count,
                msg_date_count,
                msg_date: utils.getToday()
            }, { where: { id } }).then(() => {
                return true;
            });
        },

        /**
         * Branch message info
         * @param id
         * @returns {*}
         */
        getBranchMsgInfo: (id) => {
            return Branch.findOne({
                attributes: ['id', 'sender_id', 'remaining_msg', 'msg_session_count', 'msg_date_count', 'msg_date'],
                where: { id }
            }).then((branchInfo) => {
                return branchInfo;
            });
        },

        transportMsg: (branch_id, studentList, msg) => {
            const contactNo = studentList.map((row) => {
                return row.parent.contact_no;
            });

            return message.getBranchMsgInfo(branch_id).then((branchInfo) => {
                if (branchInfo.remaining_msg > 0 && branchInfo.sender_id) {
                    const remining = parseInt(branchInfo.remaining_msg) - contactNo.length,
                        date_count = utils.getToday() === utils.formatDate(branchInfo.msg_date) ? parseInt(branchInfo.msg_date_count) + contactNo.length : contactNo.length,
                        total = parseInt(branchInfo.msg_session_count) + contactNo.length,
                        url = commonUrl + 'sender=' + branchInfo.sender_id + '&phone=' + contactNo.toString() + '&text=' + msg;

                    return message.updateCounter(branch_id, remining, total, date_count).then(() => {
                        message.msgSender(url);
                        return true;
                    });
                } else {
                    return true;
                }
            });
        }
    };

module.exports = message;
