const async = require('async');
const db = require('../../database');
const Periods = db.models.Periods;

function addPeriods(req, res, next) {    
    const section_id = req.body.section_id;
    const data = req.body.timetable;
    Periods.findOne({
        where: { section_id }
    }).then((periods) => {
        if (!periods) {
            return async.map(data, (tableData, cb) => {
                if (tableData.timings.type === 'Period') {
                    async.map(tableData.periods, (period, cb) => {
                        Periods.create({
                            section_id: section_id,
                            class_subject_id: period.subject_id,
                            timings_id: period.timings_id,
                            day: period.day,
                            description: period.description
                        }).then(() => cb()).catch(() => cb());
                    }, cb());
                } else {
                    cb();
                }
            }, (err) => {
                if (err) {
                    return next(err);
                }
                res.json({
                    status: true,
                    message: 'Timetable created successfully'
                });
            });
        }
        res.json({
            status: false,
            message: 'Timetable already exist'
        });
    });
}

module.exports = addPeriods;
