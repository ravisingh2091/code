'use strict';
const sequelize = require('sequelize');
const utils = require('../lib/utils');
const db = require('../database');
const connection = db.connection;
const Branch = db.models.Branch;
const Session = db.models.Session;
const Student = db.models.Student;
const StudentSection = db.models.StudentSection;
const Section = db.models.Section;
const Parent = db.models.Parent;
const ParentDevice = db.models.ParentDevice;

const student = {
    /**
     * Get student reg number when add new student
     * @param branch_id
     * @returns {*}
     */
    getStuRegNo: (branch_id) => {
        return Branch.findOne({
            attributes: ['id', 'start_admission_no'],
            where: {
                id: branch_id
            }
        }).then((branch) => {
            if (branch.start_admission_no) {
                return StudentSection.max('student.admission_no', {
                    include: [
                        {
                            required: true,
                            attributes: [],
                            model: Student,
                            as: 'student'
                        },
                        {
                            required: true,
                            attributes: [],
                            model: Session,
                            as: 'session'
                        }],
                    where: {
                        '$session.branch_id$': branch_id
                    }
                }).then((student) => {
                    if (!student) {
                        return branch.start_admission_no;
                    }
                    return branch.start_admission_no > student ? branch.start_admission_no : student + 1;
                });
            } else {
                return false;
            }
        });
    },

    /**
     * Get student roll no when add new student
     * @param section_id
     * @param session_id
     * @returns {*}
     */
    getStuRollNo: (section_id, session_id) => {
        return StudentSection.findOne({
            attributes: ['id', [sequelize.fn('MAX', sequelize.col('roll_no')), 'maxRollNo']],
            where: {
                session_id,
                section_id
            }
        }).then((studentInfo) => {
            const rollNo = studentInfo.get().maxRollNo;
            if (rollNo) {
                return +rollNo + 1;
            } else {
                return null;
            }
        });
    },

    /**
     * get student current session info
     * @param studentId
     */
    getStudentSection: (studentId) => {
        return StudentSection.findOne({
            attributes: ['id', 'section_id', 'session_id'],
            where: {
                student_id: studentId,
                status: 'STUDYING'
            }
        }).then((data) => {
            return data;
        });
    },

    /**
     * Get branch info
     * @param branch_id
     */
    getBranchInfo: (branch_id) => {
        return Branch.findOne({
            where: {
                id: branch_id
            }
        }).then((branchInfo) => {
            return branchInfo;
        });
    },

    /**
     * Validate parent already exists
     * @param contact_no
     * @param parent_id
     * @returns {*}
     */
    parentExist: (contact_no, parent_id = false) => {
        const whereCondition = { contact_no };
        if (parent_id) {
            whereCondition.$not = { id: parent_id };
        }
        return Parent.findOne({ where: whereCondition }).then((parent) => {
            return parent;
        });
    },

    /**
     * add parent info
     * @param data
     * @returns {*}
     */
    addParent: (data) => {
        return Parent.create({
            father_name: utils.toTitleCase(data.father_name),
            mother_name: utils.toTitleCase(data.mother_name),
            email: data.email ? data.email : null,
            contact_no: data.contact_no,
            father_aadhar_no: data.father_aadhar_no,
            mother_aadhar_no: data.mother_aadhar_no ? data.mother_aadhar_no : null,
            father_no: data.father_no ? data.father_no : null,
            mother_no: data.mother_no ? data.mother_no : null,
            father_qualification: data.father_qualification ? data.father_qualification : null,
            mother_qualification: data.mother_qualification ? data.mother_qualification : null,
            father_occupation: data.father_occupation ? data.father_occupation : null,
            mother_occupation: data.mother_occupation ? data.mother_occupation : null,
            religion: data.religion ? data.religion : null,
            category: data.category ? data.category : null,
            nationality: data.nationality ? data.nationality : null,
            street: data.street ? data.street : null,
            city: data.city ? data.city : null,
            state: data.state ? data.state : null,
            country: data.country ? data.country : null,
            pincode: data.pincode ? data.pincode : null
        }).then((parent) => {
            return parent;
        });
    },

    /**
     * update parent info
     * @param data
     * @returns {*}
     */
    updateParent: (data, id) => {
        data.parent_id = id;
        return Parent.update({
            father_name: utils.toTitleCase(data.father_name),
            mother_name: utils.toTitleCase(data.mother_name),
            email: data.email ? data.email : null,
            // contact_no: data.contact_no,
            father_aadhar_no: data.father_aadhar_no,
            mother_aadhar_no: data.mother_aadhar_no ? data.mother_aadhar_no : null,
            father_no: data.father_no ? data.father_no : null,
            mother_no: data.mother_no ? data.mother_no : null,
            father_qualification: data.father_qualification ? data.father_qualification : null,
            mother_qualification: data.mother_qualification ? data.mother_qualification : null,
            father_occupation: data.father_occupation ? data.father_occupation : null,
            mother_occupation: data.mother_occupation ? data.mother_occupation : null,
            religion: data.religion ? data.religion : null,
            category: data.category ? data.category : null,
            nationality: data.nationality ? data.nationality : null,
            street: data.street ? data.street : null,
            city: data.city ? data.city : null,
            state: data.state ? data.state : null,
            country: data.country ? data.country : null,
            pincode: data.pincode ? data.pincode : null
        }, { where: { id: data.parent_id } }).then(() => {
            return true;
        });
    },

    /**
     * add student info
     * @param data
     * @param parent_id
     * @param reg_no
     * @returns {*}
     */
    addStudent: (data, parent_id, reg_no = false) => {
        return Student.create({
            admission_no: reg_no ? reg_no : data.admission_no,
            parent_id: parent_id,
            first_name: utils.toTitleCase(data.first_name),
            last_name: data.last_name ? utils.toTitleCase(data.last_name) : null,
            dob: utils.formatDate(data.dob),
            gender: data.gender,
            barcode: data.barcode ? data.barcode : null,
            admission_date: utils.formatDate(data.admission_date),
            house: data.house ? data.house : null,
            mode_of_transport: data.mode_of_transport,
            fee_category_id: data.fee_category_id ? data.fee_category_id : null,
            aadhar_no: data.aadhar_no ? data.aadhar_no : null,
            id_proof: data.id_proof ? data.id_proof : null,
            id_proof_no: data.id_proof_no ? data.id_proof_no : null,
            blood_group: data.blood_group ? data.blood_group : null,
            photo_no: data.photo_no ? data.photo_no : null,
            remarks: data.remarks ? data.remarks : null
        }).then((student) => {
            return student;
        });
    },

    /**
     * update student info
     * @param data
     * @returns {*}
     */
    updateStudent: (data) => {
        return Student.update({
            first_name: utils.toTitleCase(data.first_name),
            last_name: data.last_name ? utils.toTitleCase(data.last_name) : null,
            dob: data.dob,
            gender: data.gender,
            barcode: data.barcode ? data.barcode : null,
            admission_date: data.admission_date,
            house: data.house ? data.house : null,
            // mode_of_transport: data.mode_of_transport,
            fee_category_id: data.fee_category_id ? data.fee_category_id : null,
            aadhar_no: data.aadhar_no ? data.aadhar_no : null,
            id_proof: data.id_proof ? data.id_proof : null,
            id_proof_no: data.id_proof_no ? data.id_proof_no : null,
            blood_group: data.blood_group ? data.blood_group : null,
            photo_no: data.photo_no ? data.photo_no : null,
            remarks: data.remarks ? data.remarks : null
        }, { where: { id: data.student_id } }).then((student) => {
            return student;
        });
    },

    /**
     * Add student section info
     * @param data
     * @param student_id
     * @param roll_no
     * @returns {*}
     */
    addStudentSection: (data, student_id, roll_no) => {
        return StudentSection.create({
            session_id: data.session_id,
            student_id: student_id,
            section_id: data.section_id,
            roll_no: roll_no,
            student_type: data.student_type
        }).then((student) => {
            return student;
        });
    },

    /**
     * Update student section info
     * @param data
     * @returns {*}
     */
    updateStudentSection: (data) => {
        return StudentSection.update({
            section_id: data.section_id,
            student_type: data.student_type
        }, { where: { id: data.id } }).then(() => {
            return true;
        });
    },

    /**
     * Get student section info
     * @param student_id
     * @returns {*}
     */
    studentSectionInfo: (student_id) => {
        return StudentSection.findOne({
            attributes: ['id', 'session_id', 'roll_no', 'student_type'],
            include: [{
                required: true,
                attributes: ['id', 'class_id'],
                model: Section,
                as: 'section'
            }, {
                required: true,
                attributes: ['id', 'first_name', 'last_name', 'admission_date', 'fee_category_id', 'due_amount', 'payable_amount', 'invoice_generated_till_date', 'trans_invoice_till_date', 'trans_due_amount', 'trans_payable_amount','photo'],
                model: Student,
                as: 'student',
                include: [{
                    required: true,
                    attributes: ['father_name', 'mother_name', 'contact_no'],
                    model: Parent,
                    as: 'parent'
                }]
            }, {
                required: true,
                attributes: ['id', 'name', 'start_date', 'end_date'],
                model: Session,
                as: 'session'
            }],
            where: {
                id: student_id
            }
        }).then((sectionInfo) => {
            return sectionInfo;
        });
    },

    /**
     * Get student list for array of class ids
     * @param classArray
     * @returns {*}
     */
    getClassStudent: (classArray) => {
        return StudentSection.findAll({
            attributes: ['id'],
            include: [{
                required: true,
                attributes: [],
                model: Section,
                as: 'section'
            }, {
                required: true,
                attributes: ['parent_id'],
                model: Student,
                as: 'student'
            }],
            where: {
                '$section.class_id$': {
                    $in: classArray
                }
            }
        }).then((studentList) => {
            return studentList;
        });
    },

    /**
     * Get parent device token for array of parent ids
     * @param parentArray
     * @returns {*}
     */
    getParentDeviceTokens: (parentArray) => {
        return ParentDevice.findAll({
            attributes: ['device_token'],
            where: {
                parent_id: {
                    $in: parentArray
                },
                status: 1
            }
        }).then((deviceTokenList) => {
            return deviceTokenList;
        });
    },

    /**
     * Get student list for particular session and section
     * @param session_id
     * @param section_id
     * @returns {*}
     */
    getSectionStudent: (session_id, section_id) => {
        return StudentSection.findAll({
            attributes: ['id', 'roll_no', 'student_type'],
            include: [{
                required: true,
                attributes: ['id', 'first_name', 'last_name', 'admission_date'],
                model: Student,
                as: 'student'
            }],
            where: {
                session_id,
                section_id
            },
            order: 'roll_no, student.first_name'
        }).then((data) => {
            return data;
        });
    },


    deleteStu: (student_section_id, student_id, parent_id) => {
        return Promise.all([
            // exam_mark_info
            connection.query(`delete A from exam_mark_info AS A INNER JOIN exam_mark AS B ON A.exam_mark_id = B.id where B.stu_sec_id=${student_section_id}`),

            // fee_carry_forward
            connection.query(`delete from fee_carry_forward where student_section_id=${student_section_id}`),

            // fee_discount
            connection.query(`delete from fee_discount where student_section_id=${student_section_id}`),

            // fee_invoice_info
            connection.query(`delete A from fee_invoice_info AS A INNER JOIN fee_invoice AS B ON A.invoice_id = B.id where student_section_id=${student_section_id}`),

            // fee_late
            connection.query(`delete from fee_late where student_section_id=${student_section_id}`),

            // fee_payment
            connection.query(`delete from fee_payment where student_section_id=${student_section_id}`),

            // one_to_one
            connection.query(`delete from one_to_one where recipient=${parent_id} AND recipient_type='Parent'`),

            // parent_device
            connection.query(`delete from parent_device where parent_id=${parent_id}`),

            // section_mark_info
            connection.query(`delete A from section_mark_info AS A INNER JOIN section_mark AS B ON A.section_mark_id = B.id where stu_sec_id=${student_section_id}`),

            // student_attendance
            connection.query(`delete from student_attendance where student_section_id=${student_section_id}`),

            // sub_test_mark
            connection.query(`delete from sub_test_mark where stu_sec_id=${student_section_id}`),

            // term_mark_info
            connection.query(`delete A from term_mark_info AS A INNER JOIN term_mark AS B ON A.term_mark_id = B.id where stu_sec_id=${student_section_id}`),

            // test_mark_info
            connection.query(`delete A from test_mark_info AS A INNER JOIN test_mark AS B ON A.test_mark_id = B.id where stu_sec_id=${student_section_id}`),

            // trans_discount
            connection.query(`delete from trans_discount where student_section_id=${student_section_id}`),

            // trans_payment
            connection.query(`delete from trans_payment where student_section_id=${student_section_id}`),

            // user_session
            connection.query(`delete A from user_session AS A INNER JOIN user AS B ON A.user_id = B.id where B.user_id=${parent_id} AND type='Parent'`),

        ]).then(() => {
            return Promise.all([
                // exam_mark
                connection.query(`delete from exam_mark where stu_sec_id=${student_section_id}`),

                // section_mark
                connection.query(`delete from section_mark where stu_sec_id=${student_section_id}`),

                // term_mark
                connection.query(`delete from term_mark where stu_sec_id=${student_section_id}`),

                // test_mark
                connection.query(`delete from test_mark where stu_sec_id=${student_section_id}`),

                // trans_invoice
                connection.query(`delete from trans_invoice where student_section_id=${student_section_id}`),

                // user
                connection.query(`delete from user where user_id=${parent_id} AND type='Parent'`),
            ]).then(() => {
                return Promise.all([
                    // fee_invoice
                    connection.query(`delete from fee_invoice where student_section_id=${student_section_id}`),

                    // trans_payment
                    connection.query(`delete from trans_payment where student_section_id=${student_section_id}`),
                ]).then(() => {
                    // student_section
                    return connection.query(`delete from student_section where id=${student_section_id}`).then(() => {
                        // student
                        return connection.query(`delete from student where id=${student_id}`).then(() => {

                            return connection.query(`select count(*) as no_of_parent from parent where id=${parent_id}`, { type: sequelize.QueryTypes.SELECT }).then((dataaa) => {

                                if (dataaa[0].no_of_parent === 0) {
                                    // parent
                                    return connection.query(`delete from parent where id=${parent_id}`).then(() => {
                                        return true;
                                    });
                                } else {
                                    return true;
                                }
                            });
                        });
                    });
                });
            });
        });
    }
};

module.exports = student;
