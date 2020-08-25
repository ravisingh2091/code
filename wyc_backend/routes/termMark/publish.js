const async = require('async'),
    utils = require('../../lib/utils'),
    commonExam = require('../../common/exam'),
    db = require('../../database'),
    ScheduleTerm = db.models.ScheduleTerm,
    TermMark = db.models.TermMark,
    TermMarkInfo = db.models.TermMarkInfo;

function publish(req, res, next) {
    let status = true;
    commonExam.getGradeList(req.query.branch_id).then((gradeList) => {
        async.eachSeries(req.body, (element, firstCb) => {
            Promise.all([
                commonExam.getScheduleTermInfo(element.schedule_term_id),
                commonExam.getNoOfExamPublish(element.schedule_term_id)
            ]).then(([scheduleTermInfo, publishExamCount]) => {
                const gradeStatus = scheduleTermInfo.patternTerm.pattern.mark_type === 'Grade' ? gradeList.length > 0 ? 1 : 0 : 1;
                if (gradeStatus === 1) {
                    if (publishExamCount === scheduleTermInfo.patternTerm.no_of_exam) {
                        Promise.all([
                            commonExam.getTermExamMark(element.schedule_term_id),
                            commonExam.getScheduleTermExamWeightage(element.schedule_term_id)
                        ]).then(([termExamMarks, totalWeightage]) => {
                            getTermMarks(termExamMarks, scheduleTermInfo.patternTerm.pass_percentage, totalWeightage, (stuTermMarks) => {
                                if (scheduleTermInfo.session.branch.grace_mark_status === '1') {
                                    addGraceMark(stuTermMarks, scheduleTermInfo, (addedGraceMark) => {
                                        addRankGrade(addedGraceMark, scheduleTermInfo, gradeList, (finalInfo) => {
                                            console.log('-------- final_mark --------');
                                            console.log(JSON.stringify(finalInfo));
                                            console.log('----------------');
                                            console.log('----------------');
                                            async.eachSeries(finalInfo, (studentMark, secondCb) => {
                                                TermMark.create({
                                                    schedule_term_id: element.schedule_term_id,
                                                    stu_sec_id: studentMark.stu_sec_id,
                                                    mark: studentMark.total,
                                                    status: studentMark.status,
                                                    rank: studentMark.rank
                                                }).then((termMarkInfo) => {
                                                    async.eachSeries(studentMark.subMark, (subMark, thirdCb) => {
                                                        TermMarkInfo.create({
                                                            term_mark_id: termMarkInfo.id,
                                                            subject_id: subMark.subject_id,
                                                            mark: subMark.mark,
                                                            grace_mark: subMark.grace_mark,
                                                            total_mark: subMark.mark + subMark.grace_mark,
                                                            status: subMark.status,
                                                            grade: subMark.grade
                                                        }).then(() => thirdCb());
                                                    }, secondCb());
                                                });
                                            }, () => {
                                                ScheduleTerm.update({ publish_date: utils.getToday(), status: 'Publish' }, { where: { id: element.schedule_term_id } })
                                                    .then(() => firstCb());
                                            });
                                        });
                                    });
                                } else {
                                    addRankGrade(stuTermMarks, scheduleTermInfo, gradeList, (finalInfo) => {
                                        console.log('-------- final_mark --------');
                                        console.log(JSON.stringify(finalInfo));
                                        console.log('----------------');
                                        console.log('----------------');
                                        async.eachSeries(finalInfo, (studentMark, secondCb) => {
                                            TermMark.create({
                                                schedule_term_id: element.schedule_term_id,
                                                stu_sec_id: studentMark.stu_sec_id,
                                                mark: studentMark.total,
                                                status: studentMark.status,
                                                rank: studentMark.rank
                                            }).then((termMarkInfo) => {
                                                async.eachSeries(studentMark.subMark, (subMark, thirdCb) => {
                                                    TermMarkInfo.create({
                                                        term_mark_id: termMarkInfo.id,
                                                        subject_id: subMark.subject_id,
                                                        mark: subMark.mark,
                                                        grace_mark: subMark.grace_mark,
                                                        total_mark: subMark.mark + subMark.grace_mark,
                                                        status: subMark.status,
                                                        grade: subMark.grade
                                                    }).then(() => thirdCb());
                                                }, secondCb());
                                            });
                                        }, () => {
                                            ScheduleTerm.update({ publish_date: utils.getToday(), status: 'Publish' }, { where: { id: element.schedule_term_id } })
                                                .then(() => firstCb());
                                        });
                                    });
                                }
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
            const message = status ? `Term mark published successfully` : 'Some selected section term mark not published (insufficient exam result)';
            return res.json({
                status: true,
                message: message
            });
        });
    });
}

module.exports = publish;

function getTermMarks(termExamMarks, passMark, totalWeightage, callback) {
    const stuSubjectMark = [];
    termExamMarks.forEach(element => {
        if (!stuSubjectMark.some(row => row.stu_sec_id === element.stu_sec_id)) {
            stuSubjectMark.push({
                stu_sec_id: element.stu_sec_id,
                total: element.final_mark,
                subjectMark: [{
                    subject_id: element.subject_id,
                    mark: element.final_mark
                }]
            });
        } else {
            const targetRow = stuSubjectMark.filter(row => row.stu_sec_id === element.stu_sec_id)[0];
            targetRow.total += element.final_mark;
            targetRow.subjectMark.push({
                subject_id: element.subject_id,
                mark: element.final_mark
            });
        }
    });

    const finalMarks = [];
    const percentage = totalWeightage / 100;
    stuSubjectMark.forEach(element => {
        const myObj = {};
        let status = 'Pass';
        myObj['stu_sec_id'] = element.stu_sec_id;
        myObj['total'] = Math.round(element.total / percentage);
        const subArr = [];
        element.subjectMark.forEach(subElement => {
            const subMark = Math.round(subElement.mark / percentage);
            const currentStatus = passMark <= subMark ? 'Pass' : 'Fail';

            subArr.push({
                subject_id: subElement.subject_id,
                mark: subMark,
                grace_mark: 0,
                status: currentStatus,
                grade: null
            });

            if (status === 'Pass' && currentStatus === 'Fail') {
                status = 'Fail';
            }
        });
        myObj['status'] = status;
        myObj['rank'] = null;
        myObj['grade'] = null;
        myObj['subMark'] = subArr;
        finalMarks.push(myObj);
    });
    return callback(finalMarks);
}

function addGraceMark(data, termInfo, callback) {
    console.log(JSON.stringify(termInfo));

    console.log(JSON.stringify(data));

    const max_grace_subject = termInfo.session.branch.max_grace_subject,
        max_grace_mark = termInfo.session.branch.max_grace_mark,
        passMark = termInfo.patternTerm.pass_percentage,
        finalArr = [];

    data.forEach((element) => {
        const myObj = {};
        let status = element.status, subArr;
        myObj['stu_sec_id'] = element.stu_sec_id;
        myObj['total'] = element.total;

        if (element.status === 'Fail') {
            const newsubMark = [];
            element.subMark.forEach((subjectMarks) => {
                if (subjectMarks.status === 'Pass') {
                    newsubMark.push({
                        subject_id: subjectMarks.subject_id,
                        mark: subjectMarks.mark,
                        grace_mark: subjectMarks.grace_mark,
                        status: subjectMarks.status,
                        grade: subjectMarks.grade
                    });
                }
            });
            const failSub = element.subMark.filter((row) => { return row.status === 'Fail'; });
            const sortFailSub = failSub.sort((a, b) => {
                return b.mark - a.mark;
            });

            let noOfGraceMarkGiven = 1;

            sortFailSub.forEach(failSub => {
                const defaultSubMark = {
                    subject_id: failSub.subject_id,
                    mark: failSub.mark,
                    grace_mark: failSub.grace_mark,
                    status: failSub.status,
                    grade: failSub.grade
                };

                if (noOfGraceMarkGiven <= max_grace_subject) {
                    const req_grace_mark = passMark - failSub.mark;
                    if (req_grace_mark <= max_grace_mark) {
                        noOfGraceMarkGiven++;
                        defaultSubMark.status = 'Pass';
                        defaultSubMark.grace_mark = req_grace_mark;
                        newsubMark.push(defaultSubMark);
                    } else {
                        newsubMark.push(defaultSubMark);
                    }
                } else {
                    newsubMark.push(defaultSubMark);
                }
            });
            if (noOfGraceMarkGiven === sortFailSub.length && noOfGraceMarkGiven > 0) {
                status = 'Pass';
            }

            subArr = newsubMark;
        } else {
            subArr = element.subMark;
        }
        myObj['status'] = status;
        myObj['rank'] = null;
        // myObj['grade'] = null;
        myObj['subMark'] = subArr;
        finalArr.push(myObj);
    });

    return callback(finalArr);
}

// return based on if condition
// get grade mark list top of the api
function addRankGrade(data, termInfo, gradeList, callback) {
    console.log(JSON.stringify(termInfo));
    console.log(termInfo.patternTerm.pattern.mark_type);
    console.log('---------------------------------');

    if (termInfo.session.branch.rank_status === '1' && termInfo.patternTerm.pattern.mark_type === 'Grade') {
        const gradeArray = [];
        data.forEach((element) => {
            const myObj = {};
            myObj['stu_sec_id'] = element.stu_sec_id;
            myObj['total'] = element.total;
            myObj['status'] = element.status;
            myObj['rank'] = element.rank;
            // myObj['grade'] = total_grade_obj.grade;
            const subArr = [];
            element.subMark.forEach((subjectMark) => {
                const total = subjectMark.mark + subjectMark.grace_mark;
                const grade_obj = gradeList.find((row) => { return row.from_mark <= total && row.to_mark >= total; });
                subArr.push({
                    subject_id: subjectMark.subject_id,
                    mark: subjectMark.mark,
                    grace_mark: subjectMark.grace_mark,
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
    } else if (termInfo.session.branch.rank_status === '1') {
        console.log('##############################');
        console.log('GRADE  2 ELSE IF');
        console.log('##############################');

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
    } else if (termInfo.patternTerm.pattern.mark_type === 'Grade') {
        console.log('##############################');
        console.log('GRADE  3 ELSE IF');
        console.log('##############################');
        const gradeArray = [];
        data.forEach((element) => {
            const myObj = {};
            myObj['stu_sec_id'] = element.stu_sec_id;
            myObj['total'] = element.total;
            myObj['status'] = element.status;
            myObj['rank'] = element.rank;
            const subArr = [];
            element.subMark.forEach((subjectMark) => {
                const total = subjectMark.mark + subjectMark.grace_mark;
                const grade_obj = gradeList.find((row) => { return row.from_mark <= total && row.to_mark >= total; });
                subArr.push({
                    subject_id: subjectMark.subject_id,
                    mark: subjectMark.mark,
                    grace_mark: subjectMark.grace_mark,
                    status: subjectMark.status,
                    grade: grade_obj.grade
                });
            });
            myObj['subMark'] = subArr;
            gradeArray.push(myObj);
        });
        return callback(gradeArray);
    } else {
        console.log('##############################');
        console.log('GRADE  4 ELSE ');
        console.log('##############################');
        return callback(data);
    }
}

