const db = require('../../database');
const ScheduleTest = db.models.ScheduleTest;
const ScheduleTestInfo = db.models.ScheduleTestInfo;
const Subject = db.models.Subject;

function testList(req, res, next) {
    ScheduleTestInfo.findAll({
        attributes: ['id', 'date', 'start_time', 'end_time', 'wriiten_max_mark', 'pritical_max_mark', 'type'],
        include: [{
            required: true,
            attributes: ['id', 'name'],
            model: Subject,
            as: 'subject'
        }, {
            required: true,
            attributes: [],
            model: ScheduleTest,
            as: 'scheduleTest'
        }],
        where: {
            schedule_test_id: req.query.test_id
        }
    }).then(([testInfo, schedule]) => {
        res.json({
            status: true,
            message: 'Test schedule listed successfully',
            data: {
                testInfo,
                schedule
            }
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = testList;
