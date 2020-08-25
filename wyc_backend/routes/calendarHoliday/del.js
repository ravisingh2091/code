const commonCalendar = require('../../common/calendar');
const db = require('../../database');
const CalendarHoliday = db.models.CalendarHoliday;

function del(req, res, next) {
    CalendarHoliday.findById(req.params.id).then((calendarHoliday) => {
        if (calendarHoliday) {
            return CalendarHoliday.destroy({
                where: { id: req.params.id }
            }).then(() => {
                return commonCalendar.sendAssignCalendarUpdate(calendarHoliday.calendar_id, calendarHoliday.holiday_id, 'DELETE', req.params.id).then(() => {
                    res.json({
                        status: true,
                        message: 'Holiday removed form calendar successfully'
                    });
                });
            }).catch((err) => {
                next(err);
            });
        }
        res.json({
            status: false,
            message: 'Holiday not exists'
        });
    });
}

module.exports = del;
