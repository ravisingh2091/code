const sequelize = require('sequelize');
const db = require('../../database');
const Class = db.models.Class;
const Section = db.models.Section;
const ClassTeacher = db.models.ClassTeacher;
const ClassSubject = db.models.ClassSubject;
const StudentSection = db.models.StudentSection;

function viewClass(req, res, next) {
    const session_id = req.query.session_id;
    Promise.all([
        ClassTeacher.findAll({
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
                    as: 'class'
                }]
            }],
            where: { session_id },
            order: ['section.class.sort']
        }),
        ClassSubject.findAll({
            attributes: ['section_id', [sequelize.fn('COUNT', sequelize.col('section_id')), 'teacherCount']],
            include: [{
                required: true,
                attributes: [],
                model: Section,
                as: 'section',
                include: [{
                    required: true,
                    attributes: [],
                    model: Class,
                    as: 'class'
                }]
            }],
            where: {
                teacher_id: {
                    $not: null
                },
                '$section.class.branch_id$': req.query.branch_id,
            },
            order: ['section.class.sort'],
            group: ['section_id']
        }),
        StudentSection.findAll({
            attributes: ['section_id', [sequelize.fn('COUNT', sequelize.col('student_id')), 'studentCount']],
            include: [{
                required: true,
                attributes: [],
                model: Section,
                as: 'section',
                include: [{
                    required: true,
                    attributes: [],
                    model: Class,
                    as: 'class'
                }]
            }],
            where: {
                status: 'STUDYING',
                session_id
            },
            order: ['section.class.sort'],
            group: ['section_id']
        })
    ]).then(([classInfo, teacherInfo, studentInfo]) => {
        if (classInfo.length) {
            return getMergedInfo(classInfo, teacherInfo, studentInfo, (result) => {
                res.json({
                    status: true,
                    message: 'session classes info listed successfully',
                    data: result
                });
            });
        } else {
            return res.json({
                status: false,
                message: 'No section available!',
            });
        }
    }).catch((err) => {
        next(err);
    });
}

module.exports = viewClass;

function getMergedInfo(classInfo, teacherInfo, studentInfo, callback) {
    const teacherSectionCount = [];
    teacherInfo.forEach((teacher) => {
        teacher = teacher.get();
        teacherSectionCount.push({
            section_id: teacher.section_id,
            teacherCount: teacher.teacherCount
        });
    });

    const stuSectionCount = [];
    studentInfo.forEach((student) => {
        student = student.get();
        stuSectionCount.push({
            section_id: student.section_id,
            studentCount: student.studentCount
        });
    });

    const merged = [];
    classInfo.forEach((element) => {
        const teacherData = teacherSectionCount.filter(function (teacher) {
            return teacher.section_id === element.section.id;
        })[0];

        const studentData = stuSectionCount.filter(function (stu) {
            return stu.section_id === element.section.id;
        })[0];

        const no_of_teacher = teacherData !== undefined ? teacherData.teacherCount : 0;
        const no_of_student = studentData !== undefined ? studentData.studentCount : 0;

        if (!merged.some((check) => {
            return check.class_id === element.section.class.id;
        })) {
            merged.push({
                class_id: element.section.class.id,
                class_name: element.section.class.name,
                total_teacher: no_of_teacher,
                total_student: no_of_student,
                section: [{
                    id: element.section.id,
                    name: element.section.name,
                    no_of_teacher,
                    no_of_student
                }]
            });
        } else {
            const targetRow = merged.filter(function (targetRow) {
                return targetRow.class_id === element.section.class.id;
            })[0];
            targetRow.total_teacher += no_of_teacher;
            targetRow.total_student += no_of_student;
            targetRow.section.push({
                id: element.section.id,
                name: element.section.name,
                no_of_teacher,
                no_of_student
            });
        }
    });
    return callback(merged);
}
