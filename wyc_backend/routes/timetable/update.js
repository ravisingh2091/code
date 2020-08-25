const async = require('async');
const db = require('../../database');
const Timetable = db.models.Timetable;
const Timings = db.models.Timings;

function update(req, res, next) {
    const data = req.body;

    Timetable.find({
        where: {
            branch_id: req.query.branch_id,
            name: data.name,
            $not: {
                id: data.id
            }
        }
    }).then((timetable) => {
        if (!timetable) {
            return Timetable.update({
                name: data.name,
                summer_start_time: data.summer_start_time,
                winter_start_time: data.winter_start_time,
                no_of_days: data.no_of_days
            }, { where: { id: data.id } }).then(() => {
                return getTimings(data, (timings) => {
                    return async.each(timings, (timing, callback) => {
                        Timings.update({
                            summer_start_time: timing.summer_start_time,
                            summer_end_time: timing.summer_end_time,
                            summer_duration: timing.summer_duration,
                            winter_start_time: timing.winter_start_time,
                            winter_end_time: timing.winter_end_time,
                            winter_duration: timing.winter_duration,
                            type: timing.type
                        }, { where: { id: timing.id } }).then(() => callback()).catch(() => callback());
                    }, (err) => {
                        if (err) {
                            return next(err);
                        }
                        return res.json({
                            status: true,
                            message: 'Time table updated successfully'
                        });
                    });
                });
            });
        } else {
            res.json({
                status: false,
                message: 'Timetable name already exists'
            });
        }
    }).catch((err) => {
        next(err);
    });
}

function getTimings(data, callback) {
    const timingsList = [];
    let summer_start_time = data.summer_start_time;
    let winter_start_time = data.winter_start_time;

    let summer_end_time = '';
    let winter_end_time = '';

    for (let i = 0; i < data.periods.length; i++) {
        const summer_piece = summer_start_time.split(':');
        const winter_piece = winter_start_time.split(':');

        const summer_mins = summer_piece[0] * 60 + +summer_piece[1] + +data.periods[i].summer_duration;
        const winter_mins = winter_piece[0] * 60 + +winter_piece[1] + +data.periods[i].winter_duration;

        const summer_hours = summer_mins % (24 * 60) / 60 | 0;
        const winter_hours = winter_mins % (24 * 60) / 60 | 0;

        const summer_minute = summer_mins % 60;
        const winter_minute = winter_mins % 60;

        summer_end_time = (summer_hours > 9 ? summer_hours : '0' + summer_hours) + ':' + (summer_minute > 9 ? summer_minute : '0' + summer_minute);
        winter_end_time = (winter_hours > 9 ? winter_hours : '0' + winter_hours) + ':' + (winter_minute > 9 ? winter_minute : '0' + winter_minute);

        timingsList.push({
            id: data.periods[i].id,
            summer_start_time: summer_start_time,
            summer_end_time: summer_end_time,
            summer_duration: data.periods[i].summer_duration,
            winter_start_time: winter_start_time,
            winter_end_time: winter_end_time,
            winter_duration: data.periods[i].winter_duration,
            type: data.periods[i].type
        });

        summer_start_time = summer_end_time;
        winter_start_time = winter_end_time;
    }
    return callback(timingsList);
}

module.exports = update;
