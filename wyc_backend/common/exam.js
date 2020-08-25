'use strict';
const db = require('../database'),
    sequelize = require('sequelize'),
    connection = db.connection,
    Pattern = db.models.Pattern,
    Branch = db.models.Branch,
    Session = db.models.Session,
    Grade = db.models.Grade,
    Term = db.models.Term,
    PatternTerm = db.models.PatternTerm,
    PatternExam = db.models.PatternExam,
    Exam = db.models.Exam,
    PatternTest = db.models.PatternTest,
    Test = db.models.Test,
    ExamSection = db.models.ExamSection,
    ScheduleSection = db.models.ScheduleSection,
    ScheduleTerm = db.models.ScheduleTerm,
    ScheduleExam = db.models.ScheduleExam,
    ScheduleTest = db.models.ScheduleTest,
    ScheduleTestInfo = db.models.ScheduleTestInfo,
    ScheduleSubTestInfo = db.models.ScheduleSubTestInfo,
    SubTestMark = db.models.SubTestMark,
    TestMark = db.models.TestMark,
    TestMarkInfo = db.models.TestMarkInfo,
    ExamMark = db.models.ExamMark,
    ExamMarkInfo = db.models.ExamMarkInfo,
    TermMark = db.models.TermMark,
    TermMarkInfo = db.models.TermMarkInfo,
    SectionMark = db.models.SectionMark,
    SectionMarkInfo = db.models.SectionMarkInfo,
    StudentSection = db.models.StudentSection,
    Student = db.models.Student,
    Section = db.models.Section,
    Class = db.models.Class,
    Subject = db.models.Subject,
   sub_test_marks = db.models.SubTestMark,
    commonExam = {
        getGradeList: (branch_id) => {
            return Grade.findAll({ where: { branch_id } }).then((data) => {
                return data;
            });
        },
 DeleteGradeList: (branch_id) => {
            return Grade.destroy({ where: { branch_id } }).then((data) => {
                return 'success';
            });
        },
        getSessionPattern: (session_id = null, pattern_id = null) => {
            let sqlQuery = '';
            if (session_id !== null) {
                sqlQuery = `SELECT A.id as pattern_id,A.name as pattern_name,A.mark_type,B.id as pattern_term_id,C.id as pattern_exam_id,C.test_consider,C.max_mark,C.pass_percentage,C.weightage,D.id as pattern_test_id,E.id as exam_id,E.name as exam_name,F.id as test_id, F.name as test_name, G.id as term_id, G.name as term_name FROM pattern AS A INNER JOIN pattern_term AS B ON A.id = B.pattern_id INNER JOIN pattern_exam AS C ON B.id=C.pattern_term_id INNER JOIN pattern_test as D ON C.id = D.pattern_exam_id INNER JOIN exam as E ON E.id = C.exam_id INNER JOIN test AS F ON F.id=D.test_id INNER JOIN term AS G ON B.term_id=G.id where A.session_id = ${session_id}`;
            } else {
                sqlQuery = `SELECT A.id as pattern_id,A.name as pattern_name,A.mark_type,B.id as pattern_term_id,C.id as pattern_exam_id,C.test_consider,C.max_mark,C.pass_percentage,C.weightage,D.id as pattern_test_id,E.id as exam_id,E.name as exam_name,F.id as test_id, F.name as test_name, G.id as term_id, G.name as term_name FROM pattern AS A INNER JOIN pattern_term AS B ON A.id = B.pattern_id INNER JOIN pattern_exam AS C ON B.id=C.pattern_term_id INNER JOIN pattern_test as D ON C.id = D.pattern_exam_id INNER JOIN exam as E ON E.id = C.exam_id INNER JOIN test AS F ON F.id=D.test_id INNER JOIN term AS G ON B.term_id=G.id where A.id = ${pattern_id}`;
            }

            return connection.query(sqlQuery, { type: sequelize.QueryTypes.SELECT }).then((data) => {
                const result = [];
                data.forEach((element) => {
                    if (!result.some((row) => { return row.pattern_id === element.pattern_id; })) {
                        result.push({
                            pattern_id: element.pattern_id,
                            pattern_name: element.pattern_name,
                            mark_type: element.mark_type,
                            terms: [{
                                pattern_term_id: element.pattern_term_id,
                                term_id: element.term_id,
                                term_name: element.term_name,
                                exams: [{
                                    pattern_exam_id: element.pattern_exam_id,
                                    exam_id: element.exam_id,
                                    exam_name: element.exam_name,
                                    max_mark: element.max_mark,
                                    pass_percentage: element.pass_percentage,
                                    weightage: element.weightage,
                                    tests: [{
                                        pattern_test_id: element.pattern_test_id,
                                        test_id: element.test_id,
                                        test_name: element.test_name,
                                    }]
                                }]
                            }]
                        });
                    } else {
                        const patternTargetRow = result.filter((row) => { return row.pattern_id === element.pattern_id; })[0];
                        if (!patternTargetRow.terms.some((row) => { return row.pattern_term_id === element.pattern_term_id; })) {
                            patternTargetRow.terms.push({
                                pattern_term_id: element.pattern_term_id,
                                term_id: element.term_id,
                                term_name: element.term_name,
                                exams: [{
                                    pattern_exam_id: element.pattern_exam_id,
                                    exam_id: element.exam_id,
                                    exam_name: element.exam_name,
                                    max_mark: element.max_mark,
                                    pass_percentage: element.pass_percentage,
                                    weightage: element.weightage,
                                    tests: [{
                                        pattern_test_id: element.pattern_test_id,
                                        test_id: element.test_id,
                                        test_name: element.test_name,
                                    }]
                                }]
                            });
                        } else {
                            const termTargetRow = patternTargetRow.terms.filter((row) => { return row.pattern_term_id === element.pattern_term_id; })[0];
                            if (!termTargetRow.exams.some(row => row.pattern_exam_id === element.pattern_exam_id)) {
                                termTargetRow.exams.push({
                                    pattern_exam_id: element.pattern_exam_id,
                                    exam_id: element.exam_id,
                                    exam_name: element.exam_name,
                                    max_mark: element.max_mark,
                                    pass_percentage: element.pass_percentage,
                                    weightage: element.weightage,
                                    tests: [{
                                        pattern_test_id: element.pattern_test_id,
                                        test_id: element.test_id,
                                        test_name: element.test_name,
                                    }]
                                });
                            } else {
                                const targetRow = termTargetRow.exams.filter((row) => { return row.pattern_exam_id === element.pattern_exam_id; })[0];
                                targetRow.tests.push({
                                    pattern_test_id: element.pattern_test_id,
                                    test_id: element.test_id,
                                    test_name: element.test_name,
                                });
                            }
                        }
                    }
                });
                return result;
            });
        },

        getClassSectionPattern: (session_id) => {
            return ExamSection.findAll({
                attributes: ['id', 'pattern_id'],
                include: [{
                    required: true,
                    attributes: ['id', 'name'],
                    model: Section,
                    as: 'section',
                    include: [{
                        required: true,
                        attributes: ['id', 'name', 'sort'],
                        model: Class,
                        as: 'class'
                    }]
                }],
                where: {
                    session_id: session_id
                },
                order: ['section.class.sort', 'section.name']
            }).then((data) => {
                const classSectionArray = [];
                data.forEach(element => {
                    if (!classSectionArray.some((row) => { return row.id === element.section.class.id; })) {
                        classSectionArray.push({
                            id: element.section.class.id,
                            name: element.section.class.name,
                            sort: element.section.class.sort,
                            sectionInfo: [{
                                pattern_id: element.id,
                                id: element.section.id,
                                name: element.section.name
                            }]
                        });
                    } else {
                        const targetRow = classSectionArray.filter((row) => { return row.id === element.section.class.id; })[0];
                        targetRow.sectionInfo.push({
                            pattern_id: element.id,
                            id: element.section.id,
                            name: element.section.name
                        });
                    }
                });
                return classSectionArray;
            });
        },

        getSectionPattern: (session_id, section_id) => {
            return ExamSection.findOne({
                where: {
                    section_id,
                    session_id
                }
            }).then((data) => {
                return data;
            });
        },

        /**
         * Get pattern term exam list
         */
        getTermExam: (pattern_term_id) => {
            return PatternExam.findAll({
                attributes: ['id', 'no_of_test', 'test_consider', 'max_mark', 'pass_percentage', 'weightage'],
                include: [{
                    required: true,
                    attributes: ['id', 'name'],
                    model: Exam,
                    as: 'exam'
                }],
                where: { pattern_term_id }
            }).then((termExams) => {
                return termExams;
            });
        },

        /** EXAM SCHEDULE */

        getScheduleTermList: (session_id, section_id, status) => {
            const whereCondition = {
                session_id: session_id
            };

            if (status) {
                const statusArr = status.split(',');
                if (statusArr.length > 1) {
                    whereCondition.status = {
                        $in: statusArr
                    };
                } else {
                    whereCondition.status = status;
                }
            }

            if (section_id) {
                whereCondition.section_id = section_id;
            }

            return ScheduleTerm.findAll({
                attributes: ['id', 'publish_date', 'status'],
                include: [{
                    required: true,
                    attributes: ['id'],
                    model: PatternTerm,
                    as: 'patternTerm',
                    include: [{
                        required: true,
                        attributes: ['id', 'name'],
                        model: Term,
                        as: 'term'
                    }]
                }, {
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
                where: whereCondition
            }).then((data) => {
                return data;
            });
        },

        getScheduleExamInfo: (schedule_exam_id) => {
            return ScheduleExam.findOne({
                attributes: ['id'],
                include: [{
                    required: true,
                    attributes: ['id', 'no_of_test', 'test_consider', 'max_mark', 'pass_percentage'],
                    model: PatternExam,
                    as: 'patternExam',
                    include: [{
                        required: true,
                        attributes: ['id', 'no_of_exam', 'pass_percentage'],
                        model: PatternTerm,
                        as: 'patternTerm',
                        include: [{
                            required: true,
                            attributes: ['id', 'mark_type'],
                            model: Pattern,
                            as: 'pattern',
                        }]
                    }]
                }, {
                    required: true,
                    attributes: ['id'],
                    model: Session,
                    as: 'session',
                    include: [{
                        required: true,
                        attributes: ['id', 'rank_status', 'grace_mark_status', 'max_grace_mark', 'max_grace_subject'],
                        model: Branch,
                        as: 'branch'
                    }]
                }, {
                    attributes: ['id', 'status'],
                    required: true,
                    model: ScheduleTerm,
                    as: 'scheduleTerm',
                    include: [{
                        attributes: ['id', 'status'],
                        required: true,
                        model: ScheduleSection,
                        as: 'scheduleSection'
                    }]
                }],
                where: {
                    id: schedule_exam_id
                }
            }).then((data) => {
                return data;
            });
        },

        getScheduleExamList: (session_id, section_id = '', status = '') => {
            const whereCondition = {
                session_id: session_id
            };

            if (section_id) {
                whereCondition.section_id = section_id;
            }

            if (status) {
                const statusArr = status.split(',');
                if (statusArr.length > 1) {
                    whereCondition.status = {
                        $in: statusArr
                    };
                } else {
                    whereCondition.status = status;
                }
            }

            return ScheduleExam.findAll({
                attributes: ['id', 'schedule_term_id', 'publish_date', 'status'],
                include: [{
                    required: true,
                    attributes: ['id', 'no_of_test', 'test_consider', 'max_mark', 'pass_percentage', 'weightage'],
                    model: PatternExam,
                    as: 'patternExam',
                    include: [{
                        required: true,
                        attributes: ['id', 'name'],
                        model: Exam,
                        as: 'exam'
                    }, {
                        required: true,
                        attributes: ['id'],
                        model: PatternTerm,
                        as: 'patternTerm',
                        include: [{
                            required: true,
                            attributes: ['id', 'name'],
                            model: Term,
                            as: 'term'
                        }]
                    }]
                }, {
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
                where: whereCondition
            }).then(data => {
                return data;
            });
        },

        getScheduleTestInfo: (schedule_test_id) => {
            return ScheduleTest.findOne({
                attributes: ['id', 'start_date', 'end_date', 'publish_date', 'status'],
                include: [{
                    required: true,
                    attributes: ['id', 'max_mark', 'pass_percentage'],
                    model: PatternTest,
                    as: 'patternTest',
                }],
                where: { id: schedule_test_id }
            }).then((data) => {
                return data;
            });
        },

        getScheduleTestList: (session_id, section_id, status, pattern_test_id, class_id) => {
            const whereCondition = {
                session_id: session_id
            };

            if (class_id) {
                whereCondition['$section.class_id$'] = class_id;
            }

            if (section_id) {
                whereCondition.section_id = section_id;
            }

            if (status) {
                const statusArr = status.split(',');
                if (statusArr.length > 1) {
                    whereCondition.status = {
                        $in: statusArr
                    };
                } else {
                    whereCondition.status = status;
                }
            }

            if (pattern_test_id) {
                whereCondition.pattern_test_id = pattern_test_id;
            }

            return ScheduleTest.findAll({
                attributes: ['id', 'start_date', 'end_date', 'publish_date', 'status'],
                include: [{
                    required: true,
                    attributes: ['id', 'max_mark', 'pass_percentage'],
                    model: PatternTest,
                    as: 'patternTest',
                    include: [{
                        required: true,
                        attributes: ['id', 'test_consider', 'max_mark', 'pass_percentage', 'weightage'],
                        model: PatternExam,
                        as: 'patternExam',
                        include: [{
                            required: true,
                            attributes: ['id'],
                            model: PatternTerm,
                            as: 'patternTerm',
                            include: [{
                                required: true,
                                attributes: ['id', 'name'],
                                model: Term,
                                as: 'term'
                            }]
                        }, {
                            required: true,
                            attributes: ['id', 'name'],
                            model: Exam,
                            as: 'exam'
                        }]
                    }, {
                        required: true,
                        attributes: ['id', 'name'],
                        model: Test,
                        as: 'test',
                    }]
                }, {
                    required: true,
                    attributes: ['id', 'name'],
                    model: Section,
                    as: 'section',
                    include: [{
                        required: true,
                        attributes: ['id', 'name', 'sort'],
                        model: Class,
                        as: 'class'
                    }]
                }, {
                    required: true,
                    attributes: ['id', 'schedule_term_id'],
                    model: ScheduleExam,
                    as: 'scheduleExam'
                }],
                where: whereCondition,
                order: 'start_date'
            }).then((data) => {
                return data;
            });
        },

        getScheduleTestSubjects: (schedule_test_id) => {
            return ScheduleSubTestInfo.findAll({
                attributes: ['id', 'description', 'max_mark', 'date', 'start_time', 'end_time'],
                include: [{
                    required: true,
                    attributes: ['id', 'no_of_sub_test'],
                    model: ScheduleTestInfo,
                    as: 'scheduleTestInfo',
                    include: [{
                        required: true,
                        attributes: [],
                        model: ScheduleTest,
                        as: 'scheduleTest',
                    }, {
                        required: true,
                        attributes: ['id', 'name'],
                        model: Subject,
                        as: 'subject',
                    }]
                }],
                where: {
                    '$scheduleTestInfo.scheduleTest.id$': schedule_test_id,
                    // '$scheduleTestInfo.scheduleTest.status$': status
                }
            }).then((data) => {
                return data;
            });
        },

        validateAllSubTestMark: (schedule_test_id) => {
            return commonExam.getScheduleTestSubjects(schedule_test_id).then((data) => {
                if (data.length > 0) {
                    return SubTestMark.findAll({
                        include: [{
                            required: true,
                            attributes: [],
                            model: ScheduleSubTestInfo,
                            as: 'scheduleSubTestInfo',
                            include: {
                                required: true,
                                attributes: [],
                                model: ScheduleTestInfo,
                                as: 'scheduleTestInfo'
                            }
                        }],
                        where: {
                            '$scheduleSubTestInfo.scheduleTestInfo.schedule_test_id$': schedule_test_id
                        },
                        group: 'schedule_sub_test_info_id'
                    }).then((markGivenExam) => {
                        if (markGivenExam.length === data.length) {
                            return true;
                        } else {
                            return false;
                        }
                    });
                }
            });
        },

        /**
         * Get student subtest mark after adding with subject and student wise
         */
        getStudentSubjectSubTestMarkInfo: (schedule_test_id) => {
            return SubTestMark.findAll({
                attributes: ['stu_sec_id', [sequelize.fn('SUM', sequelize.col('mark')), 'total_mark']],
                include: [{
                    required: true,
                    attributes: ['id'],
                    model: ScheduleSubTestInfo,
                    as: 'scheduleSubTestInfo',
                    include: {
                        required: true,
                        attributes: ['subject_id'],
                        model: ScheduleTestInfo,
                        as: 'scheduleTestInfo'
                    }
                }],
                where: {
                    '$scheduleSubTestInfo.scheduleTestInfo.schedule_test_id$': schedule_test_id
                },
                group: ['stu_sec_id', 'scheduleSubTestInfo.schedule_test_info_id']
            }).then((data) => {
                return data;
            });
        },


        /** SCHEDULE SECTION */

        getScheduleSectionInfo: (schedule_section_id) => {
            return ScheduleSection.findOne({
                attributes: ['id', 'publish_date', 'status'],
                include: [{
                    required: true,
                    attributes: ['id', 'name', 'no_of_term', 'pass_percentage', 'mark_type'],
                    model: Pattern,
                    as: 'pattern'
                }, {
                    required: true,
                    attributes: ['id'],
                    model: Session,
                    as: 'session',
                    include: [{
                        required: true,
                        attributes: ['grace_mark_status', 'max_grace_mark', 'max_grace_subject', 'rank_status'],
                        model: Branch,
                        as: 'branch'
                    }]
                }],
                where: { id: schedule_section_id }
            }).then((scheduleInfo) => {
                return scheduleInfo;
            });
        },

        getNoOfTermPublish: (schedule_section_id) => {
            return ScheduleTerm.count({ where: { schedule_section_id, status: 'Publish' } }).then((publishExamCount) => {
                return publishExamCount;
            });
        },

        getSectionTermMark: (schedule_section_id, no_of_term) => {
            const sqlQuery = `SELECT A.subject_id, ROUND(SUM(A.mark) / ${no_of_term}) AS stuSubjectMark, B.stu_sec_id FROM term_mark_info AS A INNER JOIN term_mark AS B ON (A.term_mark_id = B.id) INNER JOIN schedule_term AS C ON (B.schedule_term_id = C.id) WHERE C.schedule_section_id = ${schedule_section_id} GROUP BY B.stu_sec_id,A.subject_id`;
            return connection.query(sqlQuery, { type: sequelize.QueryTypes.SELECT }).then((data) => {
                return data;
            });
        },

        /** SCHEDULE TERM  */

        /**
         * get Schedule term info
         */
        getScheduleTermInfo: (schedule_term_id) => {
            return ScheduleTerm.findOne({
                attributes: ['id', 'publish_date', 'status'],
                include: [{
                    required: true,
                    attributes: ['id', 'no_of_exam', 'pass_percentage'],
                    model: PatternTerm,
                    as: 'patternTerm',
                    include: [{
                        required: true,
                        attributes: ['id', 'mark_type'],
                        model: Pattern,
                        as: 'pattern',
                    }]
                }, {
                    required: true,
                    attributes: ['id'],
                    model: Session,
                    as: 'session',
                    include: [{
                        required: true,
                        attributes: ['grace_mark_status', 'max_grace_mark', 'max_grace_subject', 'rank_status'],
                        model: Branch,
                        as: 'branch'
                    }]
                }],
                where: { id: schedule_term_id }
            }).then((scheduleInfo) => {
                return scheduleInfo;
            });
        },

        getTermMark: (schedule_term_id) => {
            return TermMark.findAll({
                attributes: ['id', 'mark', 'grade'],
                include: [{
                    required: true,
                    attributes: ['id', 'roll_no'],
                    model: StudentSection,
                    as: 'studentSection',
                    include: [{
                        required: true,
                        attributes: ['id', 'first_name', 'last_name', 'admission_no'],
                        model: Student,
                        as: 'student'
                    }]
                }],
                where: {
                    schedule_term_id
                }
            }).then((data) => {
                return data;
            });
        },

        getTermMarkInfo: (term_mark_id) => {
            return TermMarkInfo.findAll({
                attributes: ['id', 'mark', 'grace_mark', 'total_mark'],
                include: [{
                    required: true,
                    attributes: ['id', 'name'],
                    model: Subject,
                    as: 'subject'
                }],
                where: {
                    term_mark_id
                }
            }).then((data) => {
                return data;
            });
        },

        /**
         * get no of exam published in term
         */
        getNoOfExamPublish: (schedule_term_id) => {
            return ScheduleExam.count({ where: { schedule_term_id, status: 'Publish' } }).then((publishExamCount) => {
                return publishExamCount;
            });
        },

        /**
         * Get exam mark for term
         */
        getTermExamMark: (schedule_term_id) => {
            const sqlQuery = `SELECT A.subject_id, SUM(A.mark * 100/D.max_mark * D.weightage / 100) AS final_mark, B.stu_sec_id AS stu_sec_id FROM exam_mark_info AS A INNER JOIN exam_mark AS B ON A.exam_mark_id = B.id INNER JOIN schedule_exam AS C ON B.schedule_exam_id = C.id INNER JOIN pattern_exam AS D ON C.pattern_exam_id = D.id WHERE C.schedule_term_id = ${schedule_term_id} GROUP BY A.subject_id, B.stu_sec_id`;

            return connection.query(sqlQuery, { type: sequelize.QueryTypes.SELECT }).then((data) => {
                return data;
            });
        },


        /** SCHEDULE EXAM MARKS*/

        listSectionMarkInfo: (schedule_section_id, stu_sec_id = '') => {
            const whereCondition = [{
                '$sectionMark.schedule_section_id$': schedule_section_id,
            }];

            if (stu_sec_id !== '') {
                whereCondition.push({ '$sectionMark.stu_sec_id$': stu_sec_id });
            }

            return SectionMarkInfo.findAll({
                attributes: ['id', 'mark', 'grade', 'status'],
                include: [{
                    required: true,
                    attributes: ['id', 'mark', 'status', 'rank'],
                    model: SectionMark,
                    as: 'sectionMark',
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
                    include: [{
                         required: true,
                    attributes: ['id', 'status'],
                    model: sub_test_marks,
                    as: 'sub_test_mark',



                    }],
                }, {
                    required: true,
                    attributes: ['id', 'name'],
                    model: Subject,
                    as: 'subject'
                }
                 ],
                where: whereCondition
            }).then((data) => {
                return data;
            });
        },


        listTermMarkInfo: (schedule_term_id, stu_sec_id = '') => {
            const whereCondition = [{
                '$termMark.schedule_term_id$': schedule_term_id,
            }];

            if (stu_sec_id !== '') {
                whereCondition.push({ '$termMark.stu_sec_id$': stu_sec_id });
            }

            return TermMarkInfo.findAll({
                attributes: ['id', 'mark', 'grace_mark', 'total_mark', 'grade', 'status'],
                include: [{
                    required: true,
                    attributes: ['id', 'mark', 'status', 'rank'],
                    model: TermMark,
                    as: 'termMark',
                    include: [{
                        required: true,
                        attributes: ['id', 'roll_no'],
                        model: StudentSection,
                        as: 'studentSection',
                        include: [{
                            required: true,
                            attributes: ['id', 'admission_no', 'first_name', 'last_name'],
                            model: Student,
                            as: 'student'
                        }]
                    }],
                }, {
                    required: true,
                    attributes: ['id', 'name'],
                    model: Subject,
                    as: 'subject'
                }],
                where: whereCondition
            }).then((data) => {
                return data;
            });
        },

        /**
        * Get schedule exam info
        */

        listExamMarkInfo: (schedule_exam_id, stu_sec_id = '') => {
            let whereCondition;
            if (stu_sec_id !== '') {
                whereCondition = {
                    '$examMark.schedule_exam_id$': schedule_exam_id,
                    '$examMark.stu_sec_id$': stu_sec_id
                };
            } else {
                whereCondition = {
                    '$examMark.schedule_exam_id$': schedule_exam_id
                };
            }

            return ExamMarkInfo.findAll({
                attributes: ['id', 'mark', 'mark_type', 'status'],
                include: [{
                    required: true,
                    attributes: ['id', 'total_mark', 'status', 'rank'],
                    model: ExamMark,
                    as: 'examMark',
                    include: [{
                        required: true,
                        attributes: ['id', 'roll_no'],
                        model: StudentSection,
                        as: 'studentSection',
                        include: [{
                            required: true,
                            attributes: ['id', 'admission_no', 'first_name', 'last_name'],
                            model: Student,
                            as: 'student'
                        }]
                    }],
                }, {
                    required: true,
                    attributes: ['id', 'name'],
                    model: Subject,
                    as: 'subject'
                }],
                where: whereCondition
            }).then((data) => {
                return data;
            });
        },

        getExamMark: (schedule_exam_id) => {
            return ExamMark.findAll({
                attributes: ['id', 'total_mark', 'rank'],
                include: [{
                    required: true,
                    attributes: ['id', 'roll_no'],
                    model: StudentSection,
                    as: 'studentSection',
                    include: [{
                        required: true,
                        attributes: ['id', 'first_name', 'last_name', 'admission_no'],
                        model: Student,
                        as: 'student'
                    }]
                }],
                where: {
                    schedule_exam_id
                }
            }).then((data) => {
                return data;
            });
        },

        getExamMarkInfo: (exam_mark_id) => {
            return ExamMarkInfo.findAll({
                attributes: ['id', 'mark', 'mark_type'],
                include: [{
                    required: true,
                    attributes: ['id', 'name'],
                    model: Subject,
                    as: 'subject'
                }],
                where: {
                    exam_mark_id
                }
            }).then((data) => {
                return data;
            });
        },


        // TEST MARK

        /**
         * Get Schedule Test marks
         */

        listTestMarkInfo: (schedule_test_id, stu_sec_id = '') => {
            let whereCondition;
            if (stu_sec_id !== '') {
                whereCondition = {
                    '$testMark.schedule_test_id$': schedule_test_id,
                    '$testMark.stu_sec_id$': stu_sec_id
                };
            } else {
                whereCondition = {
                    '$testMark.schedule_test_id$': schedule_test_id
                };
            }

            return TestMarkInfo.findAll({
                attributes: ['id', 'mark', 'status'],
                include: [{
                    required: true,
                    attributes: ['id', 'mark', 'status'],
                    model: TestMark,
                    as: 'testMark',
                    include: [{
                        required: true,
                        attributes: ['id', 'roll_no'],
                        model: StudentSection,
                        as: 'studentSection',
                        include: [{
                            required: true,
                            attributes: ['id', 'admission_no', 'first_name', 'last_name'],
                            model: Student,
                            as: 'student'
                        }]
                    }],
                }, {
                    required: true,
                    attributes: ['id', 'name'],
                    model: Subject,
                    as: 'subject'
                }],
                where: whereCondition
            }).then((data) => {
                return data;
            });
        },

        /**
         * get number of test publish in exam
         */
        getNoOfTestPublish: (schedule_exam_id) => {
            return TestMark.count({
                attributes: ['id'],
                include: [{
                    required: true,
                    attributes: [],
                    model: ScheduleTest,
                    as: 'scheduleTest'
                }],
                where: {
                    '$scheduleTest.schedule_exam_id$': schedule_exam_id
                },
                group: 'schedule_test_id'
            }).then((testMarkInfo) => {
                return testMarkInfo.length;
            });
        },

        getTestSubTestMark: (schedule_test_id, stu_sec_id = '', subject_id = '') => {
            const whereCondition = [{
                '$scheduleSubTestInfo.scheduleTestInfo.schedule_test_id$': schedule_test_id
            }];

            if (stu_sec_id !== '') {
                whereCondition.push({ stu_sec_id: stu_sec_id });
            }

            if (subject_id !== '') {
                whereCondition.push({
                    '$scheduleSubTestInfo.scheduleTestInfo.subject_id$': subject_id
                });
            }

            return SubTestMark.findAll({
                attributes: ['id', 'mark', 'status'],
                include: [{
                    required: true,
                    attributes: ['id', 'max_mark', 'description'],
                    model: ScheduleSubTestInfo,
                    as: 'scheduleSubTestInfo',
                    include: [{
                        required: true,
                        attributes: ['id'],
                        model: ScheduleTestInfo,
                        as: 'scheduleTestInfo',
                        include: [{
                            required: true,
                            attributes: ['id', 'name'],
                            model: Subject,
                            as: 'subject',
                        }]
                    }]
                }, {
                    required: true,
                    attributes: ['id', 'roll_no'],
                    model: StudentSection,
                    as: 'studentSection',
                    include: [{
                        required: true,
                        attributes: ['id', 'admission_no', 'first_name', 'last_name'],
                        model: Student,
                        as: 'student'
                    }]
                }],
                where: whereCondition
            }).then((data) => {
                return data;
            });
        },

        getScheduleTermExamWeightage: (schedule_term_id) => {
            return ScheduleExam.sum('patternExam.weightage', {
                include: [{
                    required: true,
                    attributes: ['id', 'weightage'],
                    model: PatternExam,
                    as: 'patternExam'
                }],
                where: {
                    schedule_term_id
                }
            }).then((data) => {
                return data;
            });
        }

    };

module.exports = commonExam;
