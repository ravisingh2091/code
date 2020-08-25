const utils = require('../../lib/utils');
const db = require('../../database');
const ScheduleExam = db.models.ScheduleExam;

function updateScheduleExam(req, res, next) {
    const data = req.body;

    if (!data.id) {
        return res.json({
            status: false,
            message: 'Id is required'
        });
    }

    ScheduleExam.update({ publish_date: data.publish_date }, { where: { id: data.id } }).then(() => {
        res.json({
            status: true,
            message: 'Schdule exam info updated successfully'
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = updateScheduleExam;
