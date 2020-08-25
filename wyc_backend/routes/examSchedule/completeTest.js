const db = require('../../database'),
    ScheduleTest = db.models.ScheduleTest;

function completeTest(req, res, next) {
    ScheduleTest.update({
        status: 'Complete'
    }, { where: { id: req.query.schedule_test_id } }).then(() => {
        res.json({
            status: true,
            message: 'Test completed'
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = completeTest;
