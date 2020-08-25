const calendar = require('../../common/calendar');

function get(req, res, next) {
    const calendar_id = req.params.calendar_id;

    calendar.getCalendarWeekOff(calendar_id).then((result) => {
        res.status(200).json(result);
    }).catch((err) => {
        next(err);
    });
}

module.exports = get;
