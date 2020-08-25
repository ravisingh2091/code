const db = require('../../database');
const ScheduleTest = db.models.ScheduleTest;
const ScheduleExam = db.models.Exam;

function examTest(req, res, next) {
    ScheduleTest.findOne({
        attributes: ['id', 'start_date', 'end_date', 'publish_date', 'status'],
        where: {
            id: req.query.test_id
        }
    }).then(() => {

    }).catch((err) => {
        next(err);
    });
}

module.exports = examTest;
