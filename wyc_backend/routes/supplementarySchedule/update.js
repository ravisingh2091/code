const db = require('../../database'),
    SupplementarySchedule = db.models.SupplementarySchedule;

function update(req, res, next) {
    const data = req.body;

    SupplementarySchedule.update({
        date: data.date,
        start_time: data.start_time,
        end_time: data.end_time
    }, { where: { id: data.id } }).then(() => {
        res.json({
            status: true,
            message: 'Supplementary schedule updated successfully'
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = update;
