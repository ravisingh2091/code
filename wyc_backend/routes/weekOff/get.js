const calendar = require('../../common/calendar');

function get(req, res, next) {
    const classId = req.params.classId;

    calendar.getClassCalendar(classId)
        .then(calendar.getCalendarWeekOff)
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            next(err);
        });
}

module.exports = get;
