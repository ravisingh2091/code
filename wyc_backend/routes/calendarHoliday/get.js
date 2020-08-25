const calendar = require('../../common/calendar');

function calendarHoliday(req, res, next) {
    const calendar_id = req.params.calendar_id;

    calendar.getCalendarHoliday(calendar_id).then((result) => {
        res.status(200).json({
            status: true,
            message: 'calendar holiday listed successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = calendarHoliday;
