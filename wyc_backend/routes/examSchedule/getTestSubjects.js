
const commonExam = require('../../common/exam');

function getTestSubjects(req, res, next) {
    const schedule_test_id = req.query.schedule_test_id;
    const status = req.query.status ? req.query.status : 'Progress';
    
    commonExam.getScheduleTestSubjects(schedule_test_id, status).then((testSchedule) => {
        getresult(testSchedule, (result) => {
            res.json({
                status: true,
                message: 'Test Schedule listed successfully',
                data: result
            });
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = getTestSubjects;

function getresult(data, callback) {
    const finalArray = [];
    data.forEach(element => {
        if (!finalArray.some(row => row.schedule_test_info_id === element.scheduleTestInfo.id)) {
            finalArray.push({
                schedule_test_info_id: element.scheduleTestInfo.id,
                no_of_sub_test: element.scheduleTestInfo.no_of_sub_test,
                subject_id: element.scheduleTestInfo.subject.id,
                subject_name: element.scheduleTestInfo.subject.name,
                sub_test: [{
                    id: element.id,
                    name: element.description,
                    date: element.date,
                    start_time: element.start_time,
                    end_time: element.end_time,
                    max_mark: element.max_mark
                }]
            });
        } else {
            const targetRow = finalArray.filter((row) => { return row.schedule_test_info_id === element.scheduleTestInfo.id; })[0];
            targetRow.sub_test.push({
                id: element.id,
                name: element.description,
                date: element.date,
                start_time: element.start_time,
                end_time: element.end_time,
                max_mark: element.max_mark
            });
        }
    });
    callback(finalArray);
}
