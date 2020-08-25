const commonExam = require('../../common/exam');
const db = require('../../database');
const ScheduleTest = db.models.ScheduleTest;

function readyState(req, res, next) {
    commonExam.validateAllSubTestMark(req.query.schedule_test_id).then((result) => {
        if (result) {
            return ScheduleTest.update({
                status: 'Ready'
            }, { where: { id: req.query.schedule_test_id } }).then(() => {
                res.json({
                    status: true,
                    message: 'Test in ready to publish'
                });
            });
        } else {
            res.json({
                status: true,
                message: 'All subject marks are not given'
            });
        }
    }).catch((err) => {
        next(err);
    });
}

module.exports = readyState;
