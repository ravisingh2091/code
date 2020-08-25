const db = require('../../database');
const Timetable = db.models.Timetable;

function get(req, res, next) {
    Timetable.findAll({
        attributes: ['id', 'name', 'summer_start_time', 'winter_start_time', 'no_of_days', 'no_of_period'],
        where: {
            branch_id: req.query.branch_id
        }
    }).then((result) => {
        res.json({
            status: true,
            message: 'timetable name listed successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = get;
