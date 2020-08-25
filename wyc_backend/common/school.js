'use strict';
const sequelize = require('sequelize');
const utils = require('../lib/utils');
const db = require('../database');
const Branch = db.models.Branch;
const StudentAttendance = db.models.StudentAttendance;
const StudentSection = db.models.StudentSection;
const Employee = db.models.Employee;
const Session = db.models.Session;
const User = db.models.User;
const ClassTeacher = db.models.ClassTeacher;
const Section = db.models.Section;
const Class = db.models.Class;
const Stream = db.models.Stream;
const Board = db.models.Board;

const school = {

    /**
     * Add branch Info
     * @param data
     * @returns {*}
     */
    addBranch: (data) => {
        return Branch.create({
            school_id: data.school_id,
            branch: data.branch,
            principal_name: data.principal_name,
            email: data.primary_email,
            secondary_email: data.secondary_email,
            primary_no: data.primary_no,
            secondary_no: data.secondary_no,
            affiliation_no: data.affiliation_no,
            website: data.website,
            street: data.school_street,
            city: data.school_city,
            state: data.school_state,
            country: data.school_country,
            pincode: data.school_pincode,
            description: data.description
        }).then((branch) => {
            return branch;
        });
    },

    /**
     * Get branch Info
     * @param id
     * @returns {*}
     */
    getBranchInfo: (id) => {
        return Branch.findOne({ where: { id } }).then((branchInfo) => {
            return branchInfo;
        });
    },

    /**
     * Get session Info
     * @param id
     * @returns {*}
     */
    getSessionInfo: (id) => {
        return Session.findOne({ where: { id } }).then((session) => {
            return session;
        });
    },

    /**
     * Get Branch present session
     * @param branch_id
     * @param status
     * @returns {*}
     */
    getBranchSession: (branch_id, status = 'Present') => {
        return Session.findOne({ where: { branch_id, status } }).then((session) => {
            return session;
        });
    },

    employeeCount: () => {
        return Employee.findAll({
            attributes: ['branch_id', [sequelize.fn('COUNT', sequelize.col('id')), 'no_of_employee']],
            where: {
                status: 1,
                branch_id: { $ne: null }
            },
            group: 'branch_id'
        }).then((data) => {
            return data;
        });
    },

    studentCount: () => {
        return StudentSection.findAll({
            attributes: [[sequelize.fn('COUNT', sequelize.col('StudentSection`.`id')), 'no_of_student']],
            include: [{
                required: true,
                attributes: ['branch_id'],
                model: Session,
                as: 'session'
            }],
            where: {
                status: 'STUDYING',
                '$session.status$': 'Present'
            },
            group: 'session.branch_id'
        }).then((data) => {
            return data;
        });
    },

    /**
     * Get branch employee count
     * @param branch_id
     * @returns {*}
     */
    getEmployeeCount: (branch_id) => {
        return Employee.count({
            where: {
                branch_id: branch_id,
                status: 1,
                type_id: 4
            }
        }).then(count => {
            return count;
        });
    },

    /**
     * Get branch session student count
     * @param branch_id
     * @returns {*}
     */
    getStudentCount: (branch_id) => {
        return StudentSection.count({
            attributes: [],
            include: [{
                required: true,
                attributes: [],
                model: Session,
                as: 'session'
            }],
            where: {
                status: 'STUDYING',
                '$session.branch_id$': branch_id,
                '$session.status$': 'Present'
            }
        }).then(count => {
            return count;
        });
    },

    /**
     * Get student attendance present count today
     * @param branch_id
     * @returns {*}
     */
    getStudentAttendance: (branch_id) => {
        return StudentAttendance.count({
            include: [{
                required: true,
                model: StudentSection,
                as: 'studentSection',
                include: [{
                    required: true,
                    model: Session,
                    as: 'session'
                }]
            }],
            where: {
                '$studentSection.session.branch_id$': branch_id,
                date: utils.getToday(),
                status: { $ne: 0 }
            }
        }).then((count) => {
            return count;
        });
    },

    /**
     * Add new user
     * @param data
     * @param user_id
     * @param type
     * @returns {*}
     */
    addUser: (data, user_id, type) => {
        return User.create({
            user_no: data.contact_no,
            password: utils.md5Password(data.contact_no),
            user_id: user_id,
            type: type
        }).then(() => {
            return true;
        });
    },

    /**
     * Update user info
     * @param user_no
     * @param user_id
     * @param type
     * @returns {*}
     */
    updateUser: (user_no, user_id, type) => {
        return User.update({ user_no, status: 1 }, { where: { user_id, type } }).then(() => {
            return true;
        });
    },

    /**
     * Get Section info
     * @param session_id
     * @param section_id
     * @returns {*}
     */
    getSectionInfo: (session_id, section_id) => {
        return ClassTeacher.findOne({
            attributes: ['id'],
            include: [{
                required: true,
                attributes: ['id', 'name'],
                model: Section,
                as: 'section',
                include: [{
                    required: true,
                    attributes: ['id', 'name'],
                    model: Class,
                    as: 'class',
                }]
            }, {
                attributes: ['id', 'first_name', 'last_name'],
                model: Employee,
                as: 'employee'
            }, {
                attributes: ['id', 'name'],
                model: Stream,
                as: 'stream'
            }, {
                attributes: ['id', 'name'],
                model: Board,
                as: 'board'
            }],
            where: {
                session_id, section_id
            }
        }).then((sectionInfo) => {
            return sectionInfo;
        });
    },

    /**
     * Get section student count
     * @param session_id
     * @param section_id
     * @returns {*}
     */
    getSectionStuCount: (session_id, section_id) => {
        return StudentSection.count({ where: { session_id, section_id } }).then((stuCount) => {
            return stuCount;
        });
    },

    /**
     * Get session day or month list between session start and end date
     * @param session_id
     * @param type
     * @returns {*}
     */
    getSessionList: (session_id, type = 'Month') => {
        return Session.findOne({ where: { id: session_id, status: { $not: 'Future' } } }).then((sessionInfo) => {
            if (type === 'Month') {
                return school.getMonthList(sessionInfo, (data) => {
                    return data;
                });
            } else {
                return school.getDayList(sessionInfo, (data) => {
                    return data;
                });
            }
        });
    },

    /**
     * Get month list between session from and to date
     * @param sessionInfo
     * @param callback
     * @returns {*}
     */
    getMonthList: (sessionInfo, callback) => {
        const result = [];
        let startDate = utils.getMonthFirstDate(sessionInfo.start_date);
        const endDate = utils.getMonthLastDate(utils.formatDate(sessionInfo.end_date) > utils.getToday() ? utils.getToday() : sessionInfo.end_date);
        while (endDate >= startDate) {
            result.push(utils.getMonth(startDate));
            startDate = utils.addMonth(startDate);
        }
        return callback(result);
    },

    /**
     * Get day list between session from and to date
     * @param sessionInfo
     * @param callback
     * @returns {*}
     */
    getDayList: (sessionInfo, callback) => {
        const result = [];
        let startDate = utils.formatDate(sessionInfo.start_date);
        const endDate = utils.formatDate(sessionInfo.end_date) > utils.getToday() ? utils.getToday() : sessionInfo.end_date;
        while (endDate >= startDate) {
            result.push(startDate);
            startDate = utils.addDays(startDate, 1);
        }
        return callback(result);
    }
};

module.exports = school;
