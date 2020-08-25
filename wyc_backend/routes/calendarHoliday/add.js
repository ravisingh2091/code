const commonCalendar = require('../../common/calendar');
const db = require('../../database');
const CalendarHoliday = db.models.CalendarHoliday;

function add(req, res, next) {
    const calHoliday = {
        calendar_id: req.body.calendar_id,
        holiday_id: req.body.holiday_id
    };

    CalendarHoliday.findOrCreate({
        defaults: calHoliday,
        where: calHoliday
    }).then((calHoliday) => {
        if (calHoliday[1]) {
            return commonCalendar.sendAssignCalendarUpdate(req.body.calendar_id, req.body.holiday_id, 'ADD', calHoliday[0].id).then(() => {
                return res.json(201, {
                    status: true,
                    message: 'Holiday assign to calendar successfully'
                });
            });
        }
        res.json({
            status: false,
            message: 'Holiday already exist in same calendar'
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = add;
