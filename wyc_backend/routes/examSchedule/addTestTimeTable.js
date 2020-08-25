const async = require('async'),
pushNotification = require('../../common/pushNotification'),
    utils = require('../../lib/utils'),
    db = require('../../database'),
    ScheduleTerm = db.models.ScheduleTerm,
    ScheduleExam = db.models.ScheduleExam,
    ScheduleTest = db.models.ScheduleTest,
    ScheduleTestInfo = db.models.ScheduleTestInfo,
    ScheduleSubTestInfo = db.models.ScheduleSubTestInfo;


function addTestTimeTable(req, res, next) {
    const data = req.body;

    async.eachSeries(data, (element, firstCallback) => {
        async.eachSeries(element.subjectInfo, (subjectInfo, secCallback) => {
            ScheduleTestInfo.create({
                schedule_test_id: element.schedule_test_id,
                subject_id: subjectInfo.subject_id,
                no_of_sub_test: subjectInfo.no_of_sub_test
            }).then((scheduledTestInfo) => {
                async.eachSeries(subjectInfo.subTestInfo, (subTestInfo, finalCallback) => {
                    ScheduleSubTestInfo.create({
                        schedule_test_info_id: scheduledTestInfo.id,
                        description: subTestInfo.description,
                        date: utils.formatDate(subTestInfo.date),
                        start_time: subTestInfo.start_time,
                        end_time: subTestInfo.end_time,
                        max_mark: subTestInfo.max_mark
                    }).then(() => finalCallback());
                }, secCallback());
            });
        }, () => {
            Promise.all([
                ScheduleTerm.update({ status: 'Progress' }, { where: { id: element.schedule_term_id } }),
                ScheduleExam.update({ status: 'Progress' }, { where: { id: element.schedule_exam_id } }),
                ScheduleTest.update({ status: 'Progress' }, { where: { id: element.schedule_test_id } })
            ]).then(() => {
                const msg = `${element.class_name} - ${element.section_name} ${element.test_name} has been scheduled starting from ${element.start_date}.`;
                pushNotification.studentPush('Exam time table', msg, element.section_id);
                firstCallback();
            });
        });
    }, (err) => {
        if (err) {
            next(err);
        }
        res.json({
            status: true,
            message: 'Selected section exam time table created'
        });
    });
}

module.exports = addTestTimeTable;
