const utils = require('../../lib/utils');
const db = require('../../database');
const ScheduleTest = db.models.ScheduleTest;

function updateScheduleTest(req, res, next) {
    const data = req.body;

    if (!data.id) {
        return res.json({
            status: false,
            message: 'Id is required'
        });
    }

    const updateData = {};

    if (data.start_date && data.end_date) {
        updateData.start_date = utils.formatDate(data.start_date);
        updateData.end_date = utils.formatDate(data.end_date);
    }

    if (data.publish_date) {
        updateData.publish_date = utils.formatDate(data.publish_date);
    }

    if (data.status) {
        updateData.status = data.status;
    }

    ScheduleTest.update(updateData, { where: { id: data.id } }).then(() => {
        res.json({
            status: true,
            message: 'Schdule test info updated successfully'
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = updateScheduleTest;
