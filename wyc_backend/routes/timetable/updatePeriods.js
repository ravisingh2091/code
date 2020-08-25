const async = require('async');
const db = require('../../database');
const Periods = db.models.Periods;

function updatePeriods(req, res, next) {
    const data = req.body;
    return async.map(data, (tableData, CB) => {
        if (tableData.timings.type === 'Period') {
            async.map(tableData.periods, (period, cb) => {
                Periods.update({
                    class_subject_id: period.class_subject_id,
                    description: period.description
                }, { where: { id: period.id } }).then(() => cb()).catch(() => cb());
            }, CB());
        } else {
            CB();
        }
    }, (err) => {
        if (err) {
            return next(err);
        }
        res.json({
            status: true,
            message: 'Timetable updated successfully'
        });
    });
}

module.exports = updatePeriods;
