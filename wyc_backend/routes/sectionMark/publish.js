const async = require('async'),
    utils = require('../../lib/utils'),
    commonExam = require('../../common/exam'),
    db = require('../../database'),
    ScheduleSection = db.models.ScheduleSection,
    SectionMarkInfo = db.models.SectionMarkInfo,
    SectionMark = db.models.SectionMark,
    StudentSection = db.models.StudentSection;

function publish(req, res, next) {
    let status = true;
    commonExam.getGradeList(req.query.branch_id).then((gradeList) => {
        async.eachSeries(req.body, (element, firstCb) => {
            Promise.all([
                commonExam.getScheduleSectionInfo(element.schedule_section_id),
                commonExam.getNoOfTermPublish(element.schedule_section_id)
            ]).then(([scheduleSectionInfo, publishTermCount]) => {
                const gradeStatus = scheduleSectionInfo.pattern.mark_type === 'Grade' ? gradeList.length > 0 ? 1 : 0 : 1;
                if (gradeStatus === 1) {
                    if (publishTermCount === scheduleSectionInfo.pattern.no_of_term) {
                        commonExam.getSectionTermMark(element.schedule_section_id, publishTermCount).then((sectionStuMark) => {
                            getSectionMarks(sectionStuMark, scheduleSectionInfo.pattern.pass_percentage, (stuSectionMarks) => {
                                addRankGrade(stuSectionMarks, scheduleSectionInfo, gradeList, (finalData) => {
                                    async.eachSeries(finalData, (studentMark, secondCb) => {
                                        Promise.all([
                                            SectionMark.create({
                                                schedule_section_id: element.schedule_section_id,
                                                stu_sec_id: studentMark.stu_sec_id,
                                                mark: studentMark.total,
                                                status: studentMark.status,
                                                rank: studentMark.rank
                                            }),
                                            StudentSection.update({ exam_status: studentMark.status }, { where: { id: studentMark.stu_sec_id } })
                                        ]).then((sectionMarkInfo) => {
                                            async.eachSeries(studentMark.subMark, (subMark, thirdCb) => {
                                                SectionMarkInfo.create({
                                                    section_mark_id: sectionMarkInfo[0].id,
                                                    subject_id: subMark.subject_id,
                                                    mark: subMark.mark,
                                                    status: subMark.status,
                                                    grade: subMark.grade
                                                }).then(() => thirdCb());
                                            }, secondCb());
                                        });
                                    }, () => {
                                        ScheduleSection.update({ publish_date: utils.getToday(), status: 'Publish' }, { where: { id: element.schedule_section_id } })
                                            .then(() => firstCb());
                                    });
                                });
                            });
                        });
                    } else {
                        status = false;
                        firstCb();
                    }
                } else {
                    status = false;
                    firstCb();
                }
            });
        }, (err) => {
            if (err) {
                next(err);
            }
            const message = status ? 'Section result published successfully' : 'Some selected section result not published (insufficient term result)';
            res.json({
                status: true,
                message
            });
        });
    });
}

module.exports = publish;

function getSectionMarks(sectionMarks, pass_percentage, callback) {
    const stuSubjectMark = [];
    sectionMarks.forEach(element => {
        const currentStatus = pass_percentage <= element.stuSubjectMark ? 'Pass' : 'Fail';
        if (!stuSubjectMark.some(row => row.stu_sec_id === element.stu_sec_id)) {
            stuSubjectMark.push({
                stu_sec_id: element.stu_sec_id,
                total: element.stuSubjectMark,
                rank: null,
                status: currentStatus,
                subMark: [{
                    subject_id: element.subject_id,
                    mark: element.stuSubjectMark,
                    status: currentStatus,
                    grade: null
                }]
            });
        } else {
            const targetRow = stuSubjectMark.filter(row => row.stu_sec_id === element.stu_sec_id)[0];
            targetRow.total += element.stuSubjectMark;
            targetRow.subMark.push({
                subject_id: element.subject_id,
                mark: element.stuSubjectMark,
                status: currentStatus,
                grade: null
            });

            if (targetRow.status === 'Pass' && currentStatus === 'Fail') {
                targetRow.status = 'Fail';
            }
        }
    });
    return callback(stuSubjectMark);
}

function addRankGrade(data, sectionInfo, gradeList, callback) {
    if (sectionInfo.session.branch.rank_status === '1' && sectionInfo.pattern.mark_type === 'Grade') {
        const gradeArray = [];
        data.forEach((element) => {
            const myObj = {};
            myObj['stu_sec_id'] = element.stu_sec_id;
            myObj['total'] = element.total;
            myObj['status'] = element.status;
            myObj['rank'] = element.rank;
            const subArr = [];
            element.subMark.forEach((subjectMark) => {
                const grade_obj = gradeList.find((row) => { return row.from_mark <= subjectMark.mark && row.to_mark >= subjectMark.mark; });
                subArr.push({
                    subject_id: subjectMark.subject_id,
                    mark: subjectMark.mark,
                    status: subjectMark.status,
                    grade: grade_obj.grade
                });
            });
            myObj['subMark'] = subArr;
            gradeArray.push(myObj);
        });

        const passArray = [];
        const failArray = [];
        gradeArray.forEach(element => {
            if (element.status === 'Pass') {
                passArray.push({
                    stu_sec_id: element.stu_sec_id,
                    total: element.total,
                    rank: element.rank,
                    status: element.status,
                    subMark: element.subMark
                });
            } else {
                failArray.push({
                    stu_sec_id: element.stu_sec_id,
                    total: element.total,
                    rank: 999,
                    status: element.status,
                    subMark: element.subMark
                });
            }
        });

        const sorted = passArray.sort(function (a, b) { return b.total - a.total; });

        let i = 0, lastMark = 'FIRST';
        const rankArray = sorted.map((v) => {
            if (lastMark !== v.total || lastMark === 'FIRST') {
                lastMark = v.total;
                i = i + 1;
            }
            return {
                stu_sec_id: v.stu_sec_id,
                total: v.total,
                status: v.status,
                // rank: sorted.findIndex((i) => i.total === v.total) + 1,
                rank: i,
                subMark: v.subMark
            };
        });
        return callback(rankArray.concat(failArray));
    } else if (sectionInfo.session.branch.rank_status === '1') {
        const passArray = [];
        const failArray = [];
        data.forEach(element => {
            if (element.status === 'Pass') {
                passArray.push({
                    stu_sec_id: element.stu_sec_id,
                    total: element.total,
                    rank: element.rank,
                    status: element.status,
                    subMark: element.subMark
                });
            } else {
                failArray.push({
                    stu_sec_id: element.stu_sec_id,
                    total: element.total,
                    rank: 999,
                    status: element.status,
                    subMark: element.subMark
                });
            }
        });

        const sorted = passArray.sort(function (a, b) { return b.total - a.total; });

        let i = 0, lastMark = 'FIRST';
        const rankArray = sorted.map((v) => {
            if (lastMark !== v.total || lastMark === 'FIRST') {
                lastMark = v.total;
                i = i + 1;
            }
            return {
                stu_sec_id: v.stu_sec_id,
                total: v.total,
                status: v.status,
                // rank: sorted.findIndex((i) => i.total === v.total) + 1,
                rank: i,
                subMark: v.subMark
            };
        });
        return callback(rankArray.concat(failArray));
    } else if (sectionInfo.pattern.mark_type === 'Grade') {
        const gradeArray = [];
        data.forEach((element) => {
            const myObj = {};
            myObj['stu_sec_id'] = element.stu_sec_id;
            myObj['total'] = element.total;
            myObj['status'] = element.status;
            myObj['rank'] = element.rank;
            const subArr = [];
            element.subMark.forEach((subjectMark) => {
                const grade_obj = gradeList.find((row) => { return row.from_mark <= subjectMark.mark && row.to_mark >= subjectMark.mark; });
                subArr.push({
                    subject_id: subjectMark.subject_id,
                    mark: subjectMark.mark,
                    status: subjectMark.status,
                    grade: grade_obj.grade
                });
            });
            myObj['subMark'] = subArr;
            gradeArray.push(myObj);
        });
        return callback(gradeArray);
    } else {
        return callback(data);
    }
}
