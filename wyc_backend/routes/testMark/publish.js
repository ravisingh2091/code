
const async = require('async');
const utils = require('../../lib/utils');
const commonExam = require('../../common/exam');
const commonPush = require('../../common/pushNotification');
const db = require('../../database');
const TestMark = db.models.TestMark;
const TestMarkInfo = db.models.TestMarkInfo;
const ScheduleTest = db.models.ScheduleTest;

function publish(req, res, next) {
    let status = true;
    async.eachSeries(req.body, (element, firstCb) => {
        if (element.status === 'Progress') {
            commonExam.validateAllSubTestMark(element.schedule_test_id).then((validate) => {
                if (validate) {
                    commonExam.getScheduleTestInfo(element.schedule_test_id).then((testInfo) => {
                        commonExam.getStudentSubjectSubTestMarkInfo(element.schedule_test_id).then((studentTestMark) => {
                            getTestResult(studentTestMark, testInfo, (finalData) => {
                                async.eachSeries(finalData, (stuMark, secondCb) => {
                                    TestMark.create({
                                        schedule_test_id: element.schedule_test_id,
                                        stu_sec_id: stuMark.stu_sec_id,
                                        mark: stuMark.total_mark,
                                        status: stuMark.status
                                    }).then((testMarkInfo) => {
                                        async.eachSeries(stuMark.subjectMark, (subMark, thirdCb) => {
                                            TestMarkInfo.create({
                                                test_mark_id: testMarkInfo.id,
                                                subject_id: subMark.subject_id,
                                                mark: subMark.mark,
                                                status: subMark.status,
                                                total_mark: subMark.mark
                                            }).then(() => thirdCb());
                                        }, secondCb());
                                    });
                                }, () => {
                                    ScheduleTest.update({
                                        status: 'Publish',
                                        publish_date: utils.getToday()
                                    }, { where: { id: element.schedule_test_id } }).then(() => {
                                        commonPush.studentPush('Result', element.test_name + ' result published', element.section_id);
                                        firstCb();
                                    });
                                });
                            });
                        });
                    });
                } else {
                    status = false;
                    firstCb();
                }
            });
        } else {
            commonExam.getStudentSubjectSubTestMarkInfo(element.schedule_test_id).then((studentTestMark) => {
                commonExam.getScheduleTestInfo(element.schedule_test_id).then((testInfo) => {
                    getTestResult(studentTestMark, testInfo, (finalData) => {
                        async.eachSeries(finalData, (stuMark, secondCb) => {
                            TestMark.create({
                                schedule_test_id: element.schedule_test_id,
                                stu_sec_id: stuMark.stu_sec_id,
                                mark: stuMark.total_mark,
                                status: stuMark.status
                            }).then((testMarkInfo) => {
                                async.eachSeries(stuMark.subjectMark, (subMark, thirdCb) => {
                                    TestMarkInfo.create({
                                        test_mark_id: testMarkInfo.id,
                                        subject_id: subMark.subject_id,
                                        mark: subMark.mark,
                                        status: subMark.status,
                                        total_mark: subMark.mark
                                    }).then(() => thirdCb());
                                }, secondCb());
                            });
                        }, () => {
                            ScheduleTest.update({
                                status: 'Publish',
                                publish_date: utils.getToday()
                            }, { where: { id: element.schedule_test_id } }).then(() => {
                                commonPush.studentPush('Result', element.test_name + ' result published', element.section_id);
                                firstCb();
                            });
                        });
                    });
                });
            });
        }
    }, (err) => {
        if (err) {
            next(err);
        }
        const message = status ? 'Test result published successfully' : 'Some selected section test mark not published (insufficient subject marks)';

        res.json({
            status: true,
            message
        });
    });
}

module.exports = publish;

function getTestResult(stuMark, testInfo, callback) {
    const finalArray = [];
    const passMark = testInfo.patternTest.max_mark * testInfo.patternTest.pass_percentage / 100;
    stuMark.forEach(element => {
        element = element.get();
        const currentStatus = passMark <= element.total_mark ? 'Pass' : 'Fail';
        if (!finalArray.some((row) => { return row.stu_sec_id === element.stu_sec_id; })) {
            finalArray.push({
                stu_sec_id: element.stu_sec_id,
                total_mark: element.total_mark,
                status: currentStatus,
                subjectMark: [{
                    subject_id: element.scheduleSubTestInfo.scheduleTestInfo.subject_id,
                    mark: element.total_mark,
                    status: currentStatus
                }]
            });
        } else {
            const targetRow = finalArray.filter((row) => { return row.stu_sec_id === element.stu_sec_id; })[0];
            targetRow.subjectMark.push({
                subject_id: element.scheduleSubTestInfo.scheduleTestInfo.subject_id,
                mark: element.total_mark,
                status: currentStatus
            });
            targetRow.total_mark += element.total_mark;

            if (targetRow.status === 'Pass' && currentStatus === 'Fail') {
                targetRow.status = 'Fail';
            }
        }
    });

    return callback(finalArray);
}
