const async = require('async');
const sequelize = require('sequelize');
const utils = require('../../lib/utils');
const commonExam = require('../../common/exam');
const commonPush = require('../../common/pushNotification');
const db = require('../../database');
const connection = db.connection;
const ScheduleExam = db.models.ScheduleExam;
const ExamMark = db.models.ExamMark;
const ExamMarkInfo = db.models.ExamMarkInfo;

function publish(req, res, next) {
    // const schedule_exam_id = req.query.schedule_exam_id;
    let status = true;
    async.eachSeries(req.body, (element, firstCb) => {
        Promise.all([
            commonExam.getScheduleExamInfo(element.schedule_exam_id),
            commonExam.getNoOfTestPublish(element.schedule_exam_id)
        ]).then(([scheduleExamInfo, no_of_test_publish]) => {
            if (scheduleExamInfo.patternExam.no_of_test === no_of_test_publish) {
                const sqlQuery = `SELECT A.subject_id,B.stu_sec_id, GROUP_CONCAT(A.mark) as marks FROM test_mark_info A INNER JOIN test_mark AS B ON(A.test_mark_id = B.id) INNER JOIN schedule_test C ON (B.schedule_test_id = C.id) WHERE C.schedule_exam_id=${element.schedule_exam_id} GROUP BY B.stu_sec_id,A.subject_id`;
                connection.query(sqlQuery, { type: sequelize.QueryTypes.SELECT }).then((studentTestMark) => {
                    getExamMark(studentTestMark, scheduleExamInfo, (examMarks) => {
                        async.eachSeries(examMarks, (examMark, secondCb) => {
                            ExamMark.create({
                                schedule_exam_id: element.schedule_exam_id,
                                stu_sec_id: examMark.stu_sec_id,
                                total_mark: examMark.total,
                                status: examMark.status,
                                rank: examMark.rank
                            }).then((examMarkData) => {
                                async.eachSeries(examMark.subjectMark, (examSubMark, thirdCb) => {
                                    ExamMarkInfo.create({
                                        exam_mark_id: examMarkData.id,
                                        subject_id: examSubMark.subject_id,
                                        status: examSubMark.status,
                                        mark: examSubMark.mark
                                    }).then(() => thirdCb());
                                }, secondCb());
                            });
                        }, () => {
                            ScheduleExam.update({ publish_date: utils.getToday(), status: 'Publish' }, { where: { id: element.schedule_exam_id } })
                                .then(() => {
                                    commonPush.studentPush('Result', element.exam_name + ' result published', element.section_id);
                                    firstCb();
                                });
                        });
                    });
                });
            } else {
                status = false;
                firstCb();
            }
        });
    }, (err) => {
        if (err) {
            next(err);
        }

        const message = status ? 'Exam result published successfully' : 'Some selected section exam mark not published (insufficient test result)';
        res.json({
            status: true,
            message
        });
    });
}

module.exports = publish;

function getExamMark(data, examInfo, callback) {
    const finalArray = [];
    const test_consider = examInfo.patternExam.test_consider;
    const rank_status = examInfo.session.branch.rank_status;
    const passMark = examInfo.patternExam.max_mark * examInfo.patternExam.pass_percentage / 100;

    data.forEach((element) => {
        const testmarks = element.marks.split(',').sort((a, b) => b - a);
        let examMark;
        if (test_consider === 3) {
            examMark = (+testmarks[0] + +testmarks[1] + +testmarks[2]) / 3;
        } else if (test_consider === 2) {
            examMark = (+testmarks[0] + +testmarks[1]) / 2;
        } else {
            examMark = +testmarks[0];
        }

        const currentStatus = passMark <= examMark ? 'Pass' : 'Fail';

        if (!finalArray.some((row) => { return row.stu_sec_id === element.stu_sec_id; })) {
            finalArray.push({
                stu_sec_id: element.stu_sec_id,
                total: examMark,
                rank: null,
                status: currentStatus,
                subjectMark: [{
                    subject_id: element.subject_id,
                    mark: examMark,
                    status: currentStatus
                }]
            });
        } else {
            const targetRow = finalArray.filter((row) => { return row.stu_sec_id === element.stu_sec_id; })[0];
            targetRow.subjectMark.push({
                subject_id: element.subject_id,
                mark: examMark,
                status: currentStatus
            });
            targetRow.total += examMark;

            if (targetRow.status === 'Pass' && currentStatus === 'Fail') {
                targetRow.status = 'Fail';
            }
        }
    });
    
    if (rank_status === '1') {
        const passArray = [];
        const failArray = [];

        finalArray.forEach(element => {
            if (element.status === 'Pass') {
                passArray.push({
                    stu_sec_id: element.stu_sec_id,
                    total: element.total,
                    status: element.status,
                    subjectMark: element.subjectMark
                });
            } else {
                failArray.push({
                    stu_sec_id: element.stu_sec_id,
                    total: element.total,
                    status: element.status,
                    rank: 999,
                    subjectMark: element.subjectMark
                });
            }
        });
        const sorted = passArray.sort(function (a, b) { return b.total - a.total; });
        let i = 0, lastMark = 'FIRST';
        const rankArray = sorted.map((v) => {
            // console.log(i + " BEFORE i");
            // console.log(lastMark + " BEFORE lastMark");
            if (lastMark !== v.total || lastMark === 'FIRST') {
                lastMark = v.total;
                i = i + 1;
            }
            // console.log(i + " AFTER i");
            // console.log(lastMark + " AFTER lastMark");
            return {
                stu_sec_id: v.stu_sec_id,
                total: v.total,
                status: v.status,
                rank: i,
                subjectMark: v.subjectMark
            };
        });
        return callback(rankArray.concat(failArray));
    } else {
        return callback(finalArray);
    }
}
