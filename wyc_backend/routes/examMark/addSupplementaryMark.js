const async = require('async'),
    sequelize = require('sequelize'),
    commonExam = require('../../common/exam'),
    pushNotification = require('../../common/pushNotification'),
    db = require('../../database'),
    connection = db.connection,
    ExamMark = db.models.ExamMark,
    ExamMarkInfo = db.models.ExamMarkInfo,
    TermMarkInfo = db.models.TermMarkInfo,
    TermMark = db.models.TermMark,
    SectionMark = db.models.SectionMark,
    SectionMarkInfo = db.models.SectionMarkInfo,
    SupplementarySchedule = db.models.SupplementarySchedule;


function addSupplemenntaryMark(req, res) {
    const data = req.body,
        schedule_exam_id = data.schedule_exam_id,
        stu_sec_id = data.stu_sec_id,
        subject_id = data.subject_id,
        supplementary_mark = data.mark,
        supplementary_id = data.supplementary_id || '',
        title = 'Marks Re-evalution',
        message = 'Your marks has been re-evaluated. Please check for updated marks.';

    commonExam.getScheduleExamInfo(schedule_exam_id).then((scheduleExamInfo) => {
        const rankStatus = scheduleExamInfo.session.branch.rank_status;
        return ExamMark.findOne({ where: { schedule_exam_id, stu_sec_id } }).then((examMark) => {
            const pass_percentage = scheduleExamInfo.patternExam.pass_percentage,
                examPassMark = scheduleExamInfo.patternExam.max_mark * pass_percentage / 100,
                subjectStatus = examPassMark <= data.mark ? 'Pass' : 'Fail';

            return ExamMarkInfo.update({ mark: data.mark, status: subjectStatus }, {
                where: {
                    exam_mark_id: examMark.id,
                    subject_id: subject_id
                }
            }).then(() => {
                return ExamMarkInfo.findAll({ where: { exam_mark_id: examMark.id } }).then((examMarksInfo) => {
                    const examStatus = examMarksInfo.every((row) => row.status === 'Pass');
                    const examTotal = examMarksInfo.reduce((a, b) => {
                        return a + b.mark;
                    }, 0);

                    return ExamMark.update({ total_mark: examTotal, status: examStatus ? 'Pass' : 'Fail' }, { where: { id: examMark.id } }).then(() => {
                        if (rankStatus === '1') {
                            return updateExamRank(schedule_exam_id, () => {
                                if (scheduleExamInfo.scheduleTerm.status === 'Publish') {
                                    const scheduleTermId = scheduleExamInfo.scheduleTerm.id;
                                    return getTermMark(scheduleTermId, stu_sec_id, subject_id, (termData) => {
                                        const termPostData = {
                                            termMarkSubjectMark: termData.termMarkSubjectMark,
                                            totalWeightage: termData.totalWeightage,
                                            termMarkInfo: termData.termMarkInfo,
                                            pass_percentage,
                                            stu_sec_id,
                                            subject_id,
                                            scheduleTermId,
                                            grace_mark_status: scheduleExamInfo.session.branch.grace_mark_status,
                                            max_grace_subject: scheduleExamInfo.session.branch.max_grace_subject,
                                            max_grace_mark: scheduleExamInfo.session.branch.max_grace_mark
                                        };
                                        if (scheduleExamInfo.patternExam.patternTerm.pattern.mark_type === 'Grade') {
                                            return commonExam.getGradeList(req.query.branch_id).then((gradeList) => {
                                                termPostData.gradeList = gradeList;
                                                return updateTermMark(termPostData, () => {
                                                    if (rankStatus === '1') {
                                                        return updateTermRank(scheduleTermId, () => {
                                                            if (scheduleExamInfo.scheduleTerm.scheduleSection.status === 'Publish') {
                                                                const scheduleSectionId = scheduleExamInfo.scheduleTerm.scheduleSection.id;
                                                                return getSectionMark(stu_sec_id, subject_id, scheduleSectionId, (sectionData) => {
                                                                    const sectionPostData = {
                                                                        sectionMarkSubjectMark: sectionData.sectionMarkSubjectMark,
                                                                        sectionMarkInfo: sectionData.sectionMarkInfo,
                                                                        subject_id,
                                                                        stu_sec_id,
                                                                        scheduleSectionId,
                                                                        pass_percentage,
                                                                        gradeList
                                                                    };
                                                                    return updateSectionMark(sectionPostData, () => {
                                                                        if (rankStatus === '1') {
                                                                            return updateSectionRank(scheduleSectionId, () => {
                                                                                return updateSupplementary(supplementary_mark, supplementary_id, () => {
                                                                                    pushNotification.singleStudentPush(title, message, stu_sec_id);
                                                                                    res.json({
                                                                                        status: true,
                                                                                        message: 'Exam[rank] Term[grade, rank] Section[grade, rank] updated'
                                                                                    });
                                                                                });
                                                                            });
                                                                        } else {
                                                                            return updateSupplementary(supplementary_mark, supplementary_id, () => {
                                                                                pushNotification.singleStudentPush(title, message, stu_sec_id);
                                                                                res.json({
                                                                                    status: true,
                                                                                    message: 'Exam[rank] Term[rank, grade] Section[grade] updated'
                                                                                });
                                                                            });
                                                                        }
                                                                    });
                                                                });
                                                            } else {
                                                                return updateSupplementary(supplementary_mark, supplementary_id, () => {
                                                                    pushNotification.singleStudentPush(title, message, stu_sec_id);
                                                                    res.json({
                                                                        status: true,
                                                                        message: 'Exam[rank] Term[grade, rank] updated'
                                                                    });
                                                                });
                                                            }
                                                        });
                                                    } else {
                                                        if (scheduleExamInfo.scheduleTerm.scheduleSection.status === 'Publish') {
                                                            const scheduleSectionId = scheduleExamInfo.scheduleTerm.scheduleSection.id;
                                                            return getSectionMark(stu_sec_id, subject_id, scheduleSectionId, (sectionData) => {
                                                                const sectionPostData = {
                                                                    sectionMarkSubjectMark: sectionData.sectionMarkSubjectMark,
                                                                    sectionMarkInfo: sectionData.sectionMarkInfo,
                                                                    subject_id,
                                                                    stu_sec_id,
                                                                    scheduleSectionId,
                                                                    pass_percentage,
                                                                    gradeList
                                                                };
                                                                return updateSectionMark(sectionPostData, () => {
                                                                    if (rankStatus === '1') {
                                                                        return updateSectionRank(scheduleSectionId, () => {
                                                                            return updateSupplementary(supplementary_mark, supplementary_id, () => {
                                                                                pushNotification.singleStudentPush(title, message, stu_sec_id);
                                                                                res.json({
                                                                                    status: true,
                                                                                    message: 'Exam[rank] Term[grade, rank] Section[grade, rank] updated'
                                                                                });
                                                                            });
                                                                        });
                                                                    } else {
                                                                        return updateSupplementary(supplementary_mark, supplementary_id, () => {
                                                                            pushNotification.singleStudentPush(title, message, stu_sec_id);
                                                                            res.json({
                                                                                status: true,
                                                                                message: 'Exam[rank] Term[rank, grade] Section[grade] updated'
                                                                            });
                                                                        });
                                                                    }
                                                                });
                                                            });
                                                        } else {
                                                            return updateSupplementary(supplementary_mark, supplementary_id, () => {
                                                                pushNotification.singleStudentPush(title, message, stu_sec_id);
                                                                res.json({
                                                                    status: true,
                                                                    message: 'Exam[rank] Term[grade] updated'
                                                                });
                                                            });
                                                        }
                                                    }
                                                });
                                            });
                                        } else {
                                            return updateTermMark(termPostData, () => {
                                                if (rankStatus === '1') {
                                                    return updateTermRank(scheduleTermId, () => {
                                                        if (scheduleExamInfo.scheduleTerm.scheduleSection.status === 'Publish') {
                                                            const scheduleSectionId = scheduleExamInfo.scheduleTerm.scheduleSection.id;
                                                            return getSectionMark(stu_sec_id, subject_id, scheduleSectionId, (sectionData) => {
                                                                const sectionPostData = {
                                                                    sectionMarkSubjectMark: sectionData.sectionMarkSubjectMark,
                                                                    sectionMarkInfo: sectionData.sectionMarkInfo,
                                                                    subject_id,
                                                                    stu_sec_id,
                                                                    scheduleSectionId,
                                                                    pass_percentage
                                                                };
                                                                return updateSectionMark(sectionPostData, () => {
                                                                    if (rankStatus === '1') {
                                                                        return updateSectionRank(scheduleSectionId, () => {
                                                                            return updateSupplementary(supplementary_mark, supplementary_id, () => {
                                                                                pushNotification.singleStudentPush(title, message, stu_sec_id);
                                                                                res.json({
                                                                                    status: true,
                                                                                    message: 'Exam[rank] Term[rank] Section[rank] updated'
                                                                                });
                                                                            });
                                                                        });
                                                                    } else {
                                                                        return updateSupplementary(supplementary_mark, supplementary_id, () => {
                                                                            pushNotification.singleStudentPush(title, message, stu_sec_id);
                                                                            res.json({
                                                                                status: true,
                                                                                message: 'Exam[rank] Term[rank] Section[mark] updated'
                                                                            });
                                                                        });
                                                                    }
                                                                });
                                                            });
                                                        } else {
                                                            return updateSupplementary(supplementary_mark, supplementary_id, () => {
                                                                pushNotification.singleStudentPush(title, message, stu_sec_id);
                                                                res.json({
                                                                    status: true,
                                                                    message: 'Exam[rank] Term[rank] updated'
                                                                });
                                                            });
                                                        }
                                                    });
                                                } else {
                                                    if (scheduleExamInfo.scheduleTerm.scheduleSection.status === 'Publish') {
                                                        const scheduleSectionId = scheduleExamInfo.scheduleTerm.scheduleSection.id;
                                                        return getSectionMark(stu_sec_id, subject_id, scheduleSectionId, (sectionData) => {
                                                            const sectionPostData = {
                                                                sectionMarkSubjectMark: sectionData.sectionMarkSubjectMark,
                                                                sectionMarkInfo: sectionData.sectionMarkInfo,
                                                                subject_id,
                                                                stu_sec_id,
                                                                scheduleSectionId,
                                                                pass_percentage
                                                            };
                                                            return updateSectionMark(sectionPostData, () => {
                                                                if (rankStatus === '1') {
                                                                    return updateSectionRank(scheduleSectionId, () => {
                                                                        return updateSupplementary(supplementary_mark, supplementary_id, () => {
                                                                            pushNotification.singleStudentPush(title, message, stu_sec_id);
                                                                            res.json({
                                                                                status: true,
                                                                                message: 'Exam[rank] Term[rank] Section[rank] updated'
                                                                            });
                                                                        });
                                                                    });
                                                                } else {
                                                                    return updateSupplementary(supplementary_mark, supplementary_id, () => {
                                                                        pushNotification.singleStudentPush(title, message, stu_sec_id);
                                                                        res.json({
                                                                            status: true,
                                                                            message: 'Exam[rank] Term[rank] Section[] updated'
                                                                        });
                                                                    });
                                                                }
                                                            });
                                                        });
                                                    } else {
                                                        return updateSupplementary(supplementary_mark, supplementary_id, () => {
                                                            pushNotification.singleStudentPush(title, message, stu_sec_id);
                                                            res.json({
                                                                status: true,
                                                                message: 'Exam[rank] Term[grade] updated'
                                                            });
                                                        });
                                                    }
                                                }
                                            });
                                        }
                                    });
                                } else {
                                    pushNotification.singleStudentPush('Exam Mark updation', 'Exam mark updated');
                                    return res.json({
                                        status: true,
                                        message: 'exam[rank] updated'
                                    });
                                }
                            });
                        } else {
                            if (scheduleExamInfo.scheduleTerm.status === 'Publish') {
                                const scheduleTermId = scheduleExamInfo.scheduleTerm.id;
                                return getTermMark(scheduleTermId, stu_sec_id, subject_id, (termData) => {
                                    const termPostData = {
                                        termMarkSubjectMark: termData.termMarkSubjectMark,
                                        totalWeightage: termData.totalWeightage,
                                        termMarkInfo: termData.termMarkInfo,
                                        pass_percentage,
                                        stu_sec_id,
                                        subject_id,
                                        scheduleTermId,
                                        grace_mark_status: scheduleExamInfo.session.branch.grace_mark_status,
                                        max_grace_subject: scheduleExamInfo.session.branch.max_grace_subject,
                                        max_grace_mark: scheduleExamInfo.session.branch.max_grace_mark
                                    };
                                    if (scheduleExamInfo.patternExam.patternTerm.pattern.mark_type === 'Grade') {
                                        return commonExam.getGradeList(req.query.branch_id).then((gradeList) => {
                                            termPostData.gradeList = gradeList;
                                            return updateTermMark(termPostData, () => {
                                                if (rankStatus === '1') {
                                                    return updateTermRank(scheduleTermId, () => {
                                                        if (scheduleExamInfo.scheduleTerm.scheduleSection.status === 'Publish') {
                                                            const scheduleSectionId = scheduleExamInfo.scheduleTerm.scheduleSection.id;
                                                            return getSectionMark(stu_sec_id, subject_id, scheduleSectionId, (sectionData) => {
                                                                const sectionPostData = {
                                                                    sectionMarkSubjectMark: sectionData.sectionMarkSubjectMark,
                                                                    sectionMarkInfo: sectionData.sectionMarkInfo,
                                                                    subject_id,
                                                                    stu_sec_id,
                                                                    scheduleSectionId,
                                                                    pass_percentage,
                                                                    gradeList
                                                                };
                                                                return updateSectionMark(sectionPostData, () => {
                                                                    if (rankStatus === '1') {
                                                                        return updateSectionRank(scheduleSectionId, () => {
                                                                            return updateSupplementary(supplementary_mark, supplementary_id, () => {
                                                                                pushNotification.singleStudentPush(title, message, stu_sec_id);
                                                                                res.json({
                                                                                    status: true,
                                                                                    message: 'Exam[rank] Term[grade, rank] Section[grade, rank] updated'
                                                                                });
                                                                            });
                                                                        });
                                                                    } else {
                                                                        return updateSupplementary(supplementary_mark, supplementary_id, () => {
                                                                            pushNotification.singleStudentPush(title, message, stu_sec_id);
                                                                            res.json({
                                                                                status: true,
                                                                                message: 'Exam[rank] Term[rank, grade] Section[grade] updated'
                                                                            });
                                                                        });
                                                                    }
                                                                });
                                                            });
                                                        } else {
                                                            return updateSupplementary(supplementary_mark, supplementary_id, () => {
                                                                pushNotification.singleStudentPush(title, message, stu_sec_id);
                                                                res.json({
                                                                    status: true,
                                                                    message: 'Exam[rank] Term[grade, rank] updated'
                                                                });
                                                            });
                                                        }
                                                    });
                                                } else {
                                                    if (scheduleExamInfo.scheduleTerm.scheduleSection.status === 'Publish') {
                                                        const scheduleSectionId = scheduleExamInfo.scheduleTerm.scheduleSection.id;
                                                        return getSectionMark(stu_sec_id, subject_id, scheduleSectionId, (sectionData) => {
                                                            const sectionPostData = {
                                                                sectionMarkSubjectMark: sectionData.sectionMarkSubjectMark,
                                                                sectionMarkInfo: sectionData.sectionMarkInfo,
                                                                subject_id,
                                                                stu_sec_id,
                                                                scheduleSectionId,
                                                                pass_percentage,
                                                                gradeList
                                                            };
                                                            return updateSectionMark(sectionPostData, () => {
                                                                if (rankStatus === '1') {
                                                                    return updateSectionRank(scheduleSectionId, () => {
                                                                        return updateSupplementary(supplementary_mark, supplementary_id, () => {
                                                                            pushNotification.singleStudentPush(title, message, stu_sec_id);
                                                                            res.json({
                                                                                status: true,
                                                                                message: 'Exam[rank] Term[grade, rank] Section[grade, rank] updated'
                                                                            });
                                                                        });
                                                                    });
                                                                } else {
                                                                    return updateSupplementary(supplementary_mark, supplementary_id, () => {
                                                                        pushNotification.singleStudentPush(title, message, stu_sec_id);
                                                                        res.json({
                                                                            status: true,
                                                                            message: 'Exam[rank] Term[rank, grade] Section[grade] updated'
                                                                        });
                                                                    });
                                                                }
                                                            });
                                                        });
                                                    } else {
                                                        return updateSupplementary(supplementary_mark, supplementary_id, () => {
                                                            pushNotification.singleStudentPush(title, message, stu_sec_id);
                                                            res.json({
                                                                status: true,
                                                                message: 'Exam[rank] Term[grade] updated'
                                                            });
                                                        });
                                                    }
                                                }
                                            });
                                        });
                                    } else {
                                        return updateTermMark(termPostData, () => {
                                            if (rankStatus === '1') {
                                                return updateTermRank(scheduleTermId, () => {
                                                    if (scheduleExamInfo.scheduleTerm.scheduleSection.status === 'Publish') {
                                                        const scheduleSectionId = scheduleExamInfo.scheduleTerm.scheduleSection.id;
                                                        return getSectionMark(stu_sec_id, subject_id, scheduleSectionId, (sectionData) => {
                                                            const sectionPostData = {
                                                                sectionMarkSubjectMark: sectionData.sectionMarkSubjectMark,
                                                                sectionMarkInfo: sectionData.sectionMarkInfo,
                                                                subject_id,
                                                                stu_sec_id,
                                                                scheduleSectionId,
                                                                pass_percentage
                                                            };
                                                            return updateSectionMark(sectionPostData, () => {
                                                                if (rankStatus === '1') {
                                                                    return updateSectionRank(scheduleSectionId, () => {
                                                                        return updateSupplementary(supplementary_mark, supplementary_id, () => {
                                                                            pushNotification.singleStudentPush(title, message, stu_sec_id);
                                                                            res.json({
                                                                                status: true,
                                                                                message: 'Exam[rank] Term[rank] Section[rank] updated'
                                                                            });
                                                                        });
                                                                    });
                                                                } else {
                                                                    return updateSupplementary(supplementary_mark, supplementary_id, () => {
                                                                        pushNotification.singleStudentPush(title, message, stu_sec_id);
                                                                        res.json({
                                                                            status: true,
                                                                            message: 'Exam[rank] Term[rank] Section[] updated'
                                                                        });
                                                                    });
                                                                }
                                                            });
                                                        });
                                                    } else {
                                                        return updateSupplementary(supplementary_mark, supplementary_id, () => {
                                                            pushNotification.singleStudentPush(title, message, stu_sec_id);
                                                            res.json({
                                                                status: true,
                                                                message: 'Exam[rank] Term[rank] updated'
                                                            });
                                                        });
                                                    }
                                                });
                                            } else {
                                                if (scheduleExamInfo.scheduleTerm.scheduleSection.status === 'Publish') {
                                                    const scheduleSectionId = scheduleExamInfo.scheduleTerm.scheduleSection.id;

                                                    return getSectionMark(stu_sec_id, subject_id, scheduleSectionId, (sectionData) => {
                                                        const sectionPostData = {
                                                            sectionMarkSubjectMark: sectionData.sectionMarkSubjectMark,
                                                            sectionMarkInfo: sectionData.sectionMarkInfo,
                                                            subject_id,
                                                            stu_sec_id,
                                                            scheduleSectionId,
                                                            pass_percentage
                                                        };
                                                        return updateSectionMark(sectionPostData, () => {
                                                            if (rankStatus === '1') {
                                                                return updateSectionRank(scheduleSectionId, () => {
                                                                    return updateSupplementary(supplementary_mark, supplementary_id, () => {
                                                                        pushNotification.singleStudentPush(title, message, stu_sec_id);
                                                                        res.json({
                                                                            status: true,
                                                                            message: 'Exam[rank] Term[rank] Section[rank] updated'
                                                                        });
                                                                    });
                                                                });
                                                            } else {
                                                                return updateSupplementary(supplementary_mark, supplementary_id, () => {
                                                                    pushNotification.singleStudentPush(title, message, stu_sec_id);
                                                                    res.json({
                                                                        status: true,
                                                                        message: 'Exam[rank] Term[rank] Section[] updated'
                                                                    });
                                                                });
                                                            }
                                                        });
                                                    });
                                                } else {
                                                    return updateSupplementary(supplementary_mark, supplementary_id, () => {
                                                        pushNotification.singleStudentPush(title, message, stu_sec_id);
                                                        res.json({
                                                            status: true,
                                                            message: 'Exam[rank] Term[grade] updated'
                                                        });
                                                    });
                                                }
                                            }
                                        });
                                    }
                                });
                            } else {
                                pushNotification.singleStudentPush(title, message, stu_sec_id);
                                return res.json({
                                    status: true,
                                    message: 'exam updated'
                                });
                            }
                        }
                    });
                });
            });
        });
    });
}

module.exports = addSupplemenntaryMark;


function getTermMark(scheduleTermId, stu_sec_id, subject_id, callback) {
    const termSQLQuery = `SELECT SUM(A.mark * D.weightage / 100) AS final_mark FROM exam_mark_info AS A INNER JOIN exam_mark AS B ON A.exam_mark_id = B.id INNER JOIN schedule_exam AS C ON B.schedule_exam_id = C.id INNER JOIN pattern_exam AS D ON C.pattern_exam_id = D.id WHERE C.schedule_term_id = ${scheduleTermId} AND B.stu_sec_id = ${stu_sec_id} AND A.subject_id=${subject_id}`;
    return Promise.all([
        connection.query(termSQLQuery, { type: sequelize.QueryTypes.SELECT }),
        commonExam.getScheduleTermExamWeightage(scheduleTermId),
        TermMarkInfo.findAll({
            include: [{
                required: true,
                attributes: [],
                model: TermMark,
                as: 'termMark'
            }],
            where: {
                '$termMark.schedule_term_id$': scheduleTermId
            }
        })
    ]).then(([termMarkSubjectMark, totalWeightage, termMarkInfo]) => {
        return callback({ termMarkSubjectMark, totalWeightage, termMarkInfo });
    });
}

function updateTermMark(data, callback) {
    const subIndex = data.termMarkInfo.findIndex((obj) => obj.subject_id === data.subject_id),
        ratio = data.totalWeightage / 100,
        termSubjectMark = Math.round(data.termMarkSubjectMark[0].final_mark / ratio),
        termSubjectStatus = data.pass_percentage <= termSubjectMark ? 'Pass' : 'Fail';

    data.termMarkInfo[subIndex].mark = termSubjectMark;
    data.termMarkInfo[subIndex].grace_mark = 0;
    data.termMarkInfo[subIndex].total_mark = termSubjectMark;
    data.termMarkInfo[subIndex].grade = data.gradeList ? data.gradeList.find((row) => { return row.from_mark <= termSubjectMark && row.to_mark >= termSubjectMark; }).grade : null;
    data.termMarkInfo[subIndex].status = termSubjectStatus;


    if (termSubjectStatus === 'Fail' && data.grace_mark_status === '1') {
        const alreadyGraceSubectList = data.termMarkInfo.filter((row) => row.grace_mark > 0);

        if (data.max_grace_subject > alreadyGraceSubectList) {
            const req_grace_mark = data.pass_percentage - termSubjectMark;
            if (req_grace_mark <= data.max_grace_mark) {
                const termSubjectTotal = termSubjectMark + req_grace_mark;
                data.termMarkInfo[subIndex].mark = termSubjectMark;
                data.termMarkInfo[subIndex].grace_mark = req_grace_mark;
                data.termMarkInfo[subIndex].total_mark = termSubjectTotal;
                data.termMarkInfo[subIndex].grade = data.gradeList ? data.gradeList.find((row) => { return row.from_mark <= termSubjectTotal && row.to_mark >= termSubjectTotal; }).grade : null;
                data.termMarkInfo[subIndex].status = 'Pass';
            }
        }
    }

    const termStatus = data.termMarkInfo.every((row) => row.status === 'Pass');
    const termTotal = data.termMarkInfo.reduce((a, b) => {
        return a + b.total_mark;
    }, 0);

    return Promise.all([
        TermMarkInfo.update({
            mark: data.termMarkInfo[subIndex].mark,
            grace_mark: data.termMarkInfo[subIndex].grace_mark,
            total_mark: data.termMarkInfo[subIndex].total_mark,
            grade: data.termMarkInfo[subIndex].grade,
            status: data.termMarkInfo[subIndex].status
        }, { where: { id: data.termMarkInfo[subIndex].id } }),
        TermMark.update({
            total_mark: termTotal,
            status: termStatus ? 'Pass' : 'Fail'
        }, { where: { schedule_term_id: data.scheduleTermId, stu_sec_id: data.stu_sec_id } })
    ]).then(() => {
        return callback({ termStatus, termTotal });
    });
}

function getSectionMark(stu_sec_id, subject_id, scheduleSectionId, callback) {
    const sectionQuery = `SELECT A.mark FROM term_mark_info AS A INNER JOIN term_mark AS B ON (A.term_mark_id = B.id) INNER JOIN schedule_term AS C ON (B.schedule_term_id = C.id) WHERE C.schedule_section_id = ${scheduleSectionId} AND B.stu_sec_id = ${stu_sec_id} AND  A.subject_id = ${subject_id}`;
    return Promise.all([
        connection.query(sectionQuery, { type: sequelize.QueryTypes.SELECT }),
        SectionMarkInfo.findAll({
            include: [{
                required: true,
                attributes: [],
                model: SectionMark,
                as: 'sectionMark'
            }],
            where: {
                '$sectionMark.schedule_section_id$': scheduleSectionId
            }
        })
    ]).then(([sectionMarkSubjectMark, sectionMarkInfo]) => {
        return callback({ sectionMarkSubjectMark, sectionMarkInfo });
    });
}


function updateSectionMark(data, callback) {
    const sectionMarkInfo = data.sectionMarkInfo;
    const sectionSubIndex = sectionMarkInfo.findIndex((obj) => obj.subject_id === data.subject_id);
    const sectionSubjectMark = Math.round(data.sectionMarkSubjectMark.reduce((a, b) => {
        return a + b.mark;
    }, 0) / data.sectionMarkSubjectMark.length);
    const sectionSubjectStatus = data.pass_percentage <= sectionSubjectMark ? 'Pass' : 'Fail';
    sectionMarkInfo[sectionSubIndex].mark = sectionSubjectMark;
    sectionMarkInfo[sectionSubIndex].grade = data.gradeList ? data.gradeList.find((row) => { return row.from_mark <= sectionSubjectMark && row.to_mark >= sectionSubjectMark; }).grade : null;
    sectionMarkInfo[sectionSubIndex].status = sectionSubjectStatus;

    const sectionStatus = sectionMarkInfo.every((row) => row.status === 'Pass');
    const sectionTotal = sectionMarkInfo.reduce((a, b) => {
        return a + b.mark;
    }, 0);
    return Promise.all([
        SectionMarkInfo.update({
            mark: sectionMarkInfo[sectionSubIndex].mark,
            grade: sectionMarkInfo[sectionSubIndex].grade,
            status: sectionMarkInfo[sectionSubIndex].status
        }, { where: { id: sectionMarkInfo[sectionSubIndex].id } }),
        SectionMark.update({
            total_mark: sectionTotal,
            status: sectionStatus ? 'Pass' : 'Fail'
        }, { where: { schedule_section_id: data.scheduleSectionId, stu_sec_id: data.stu_sec_id } })
    ]).then(() => {
        return callback({ sectionStatus, sectionTotal });
    });
}

function updateExamRank(schedule_exam_id, callback) {
    return ExamMark.findAll({
        where: { schedule_exam_id, status: 'Pass' },
        order: 'total_mark desc'
    }).then((passArray) => {
        if (passArray) {
            let i = 0, lastMark = 'FIRST';
            const examRankArray = passArray.map((v) => {
                if (lastMark !== v.total_mark || lastMark === 'FIRST') {
                    lastMark = v.total_mark;
                    i = i + 1;
                }
                return {
                    id: v.id,
                    rank: i
                };
            });
            return async.eachSeries(examRankArray, (examRank, cb) => {
                ExamMark.update({ rank: examRank.rank }, { where: { id: examRank.id } }).then(() => cb());
            }, () => {
                return callback(true);
            });
        } else {
            return callback(true);
        }
    });
}


function updateTermRank(schedule_term_id, callback) {
    return TermMark.findAll({
        where: {
            schedule_term_id: schedule_term_id,
            status: 'Pass',
        },
        order: 'mark desc'
    }).then((termPassArray) => {
        if (termPassArray) {
            let i = 0, lastMark = 'FIRST';
            const termRankArray = termPassArray.map((v) => {
                if (lastMark !== v.total_mark || lastMark === 'FIRST') {
                    lastMark = v.total_mark;
                    i = i + 1;
                }
                return {
                    id: v.id,
                    rank: i
                };
            });
            return async.eachSeries(termRankArray, (termRank, cb) => {
                TermMark.update({ rank: termRank.rank }, { where: { id: termRank.id } }).then(() => cb());
            }, () => {
                return callback(true);
            });
        } else {
            return callback(true);
        }
    });
}

function updateSectionRank(schedule_section_id, callback) {
    return SectionMark.findAll({
        where: {
            schedule_section_id: schedule_section_id,
            status: 'Pass',
        },
        order: 'mark desc'
    }).then((sectionPassArray) => {
        if (sectionPassArray) {
            let i = 0, lastMark = 'FIRST';
            const termRankArray = sectionPassArray.map((v) => {
                if (lastMark !== v.total_mark || lastMark === 'FIRST') {
                    lastMark = v.total_mark;
                    i = i + 1;
                }
                return {
                    id: v.id,
                    rank: i
                };
            });
            return async.eachSeries(termRankArray, (termRank, cb) => {
                TermMark.update({ rank: termRank.rank }, { where: { id: termRank.id } }).then(() => cb());
            }, () => {
                return callback(true);
            });
        } else {
            return callback(true);
        }
    });
}

function updateSupplementary(mark, id, callback) {
    if (id) {
        return SupplementarySchedule.update({ mark }, { where: { id } }).then(() => {
            return callback(true);
        });
    } else {
        return callback(true);
    }
}
