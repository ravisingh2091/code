const student = require('../../common/student');
const db = require('../../database');
const Timetable = db.models.Timetable;
const Timings = db.models.Timings;

function get(req, res, next) {
    Promise.all([
        Timetable.findById(req.query.id),
        Timings.findAll({
            where: {
                timetable_id: req.query.id
            },
            order: ['summer_start_time']
        })
    ]).then(([timeTable, timings]) => {
        if (timings.length > 0) {
            return student.getBranchInfo(req.query.branch_id).then((branchInfo) => {
                const season = branchInfo.season;
                const result = [];
                timings.forEach((timing) => {
                    result.push({
                        id: timing.id,
                        summer_start_time: timing.summer_start_time,
                        summer_end_time: timing.summer_end_time,
                        summer_duration: timing.summer_duration,
                        winter_start_time: timing.winter_start_time,
                        winter_end_time: timing.winter_end_time,
                        winter_duration: timing.winter_duration,
                        type: timing.type,
                        season: season
                    });
                });

                return res.json({
                    status: true,
                    message: 'Timing and timetable info get successfully',
                    data: {
                        timetable: timeTable,
                        timings: result
                    }
                });
            });
        }
        res.json({
            status: false,
            message: 'No Timings'
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = get;
