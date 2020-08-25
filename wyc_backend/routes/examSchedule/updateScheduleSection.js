const utils = require('../../lib/utils');
const db = require('../../database');
const ScheduleSection = db.models.ScheduleSection;

function updateScheduleSection(req, res, next) {
    const data = req.body;

    if (!data.id) {
        return res.json({
            status: false,
            message: 'Id is required'
        });
    }

    ScheduleSection.update({ publish_date: utils.formatDate(data.publish_date) }, { where: { id: data.id } }).then(() => {
        res.json({
            status: true,
            message: 'Schdule section info updated successfully'
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = updateScheduleSection;
