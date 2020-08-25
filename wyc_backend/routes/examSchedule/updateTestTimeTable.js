const async = require('async'),
    pushNotification = require('../../common/pushNotification'),
    utils = require('../../lib/utils'),
    db = require('../../database'),
    ScheduleSubTestInfo = db.models.ScheduleSubTestInfo;

function updateTestTimeTable(req, res, next) {
    const data = req.body;
    async.eachSeries(data.updateData, (timeTable, callback) => {
        ScheduleSubTestInfo.update(
            {
                date: utils.formatDate(timeTable.date),
                start_time: timeTable.start_time,
                end_time: timeTable.end_time
            }, { where: { id: timeTable.id } }).then(() => callback());
    }, (err) => {
        if (err) {
            next(err);
        }
        const msg = `${data.class_name} - ${data.section_name} ${data.test_name} has been updated.`;
        pushNotification.studentPush('Exam time table', msg, data.section_id);
        res.json({
            status: true,
            message: 'Test timetable info updated successfully'
        });
    });
}

module.exports = updateTestTimeTable;
