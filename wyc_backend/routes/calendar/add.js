const async = require('async');
const utils = require('../../lib/utils');
const commonSchool = require('../../common/school');
const db = require('../../database');
const Calendar = db.models.Calendar;
const CalendarHoliday = db.models.CalendarHoliday;
const WeekOff = db.models.WeekOff;

function add(req, res, next) {
    const data = req.body;

    if (data.week_off === 'Alternate') {
        if (!utils.checkDay(data.alternate_first_off, 6)) {
            return res.json({
                status: false,
                message: 'Select only Saturday'
            });
        }
    }

    const calendarInfo = {
        session_id: data.session_id,
        name: data.name,
        week_off: data.week_off
    };

    if (data.week_off === 'Alternate') {
        calendarInfo.alternate_first_off = data.alternate_first_off;
    }

    function getWeekOff(data, callback) {
        commonSchool.getSessionInfo(data.session_id).then((sessionInfo) => {
            let addDays = '';
            let firstLeaveOff = '';
            const saturdayList = [];
            if (data.week_off === 'Alternate') {
                firstLeaveOff = data.alternate_first_off;
                addDays = 14;
            } else {
                addDays = 7;
                const date = sessionInfo.start_date;
                const resultDate = new Date(date.getTime());
                firstLeaveOff = resultDate.setDate(date.getDate() + (7 + 6 - date.getDay()) % 7);
            }
            const leaveSaturday = new Date(firstLeaveOff);
            while (leaveSaturday < sessionInfo.end_date) {
                saturdayList.push(new Date(leaveSaturday));
                leaveSaturday.setDate(leaveSaturday.getDate() + addDays);
            }
            return callback(saturdayList);
        });
    }


    Calendar.create(calendarInfo).then((calendar) => {
        return async.each(data.holiday, (holiday, callback) => {
            CalendarHoliday.create({
                calendar_id: calendar.id,
                holiday_id: holiday
            }).then(() => callback()).catch(() => callback());
        }, (err) => {
            if (err) {
                return next(err);
            }
            if (data.week_off !== 'No') {
                return getWeekOff(data, (weekOff) => {
                    return async.each(weekOff, (offDate, callback) => {
                        WeekOff.create({
                            calendar_id: calendar.id,
                            date: utils.formatDate(offDate)
                        }).then(() => callback()).catch(() => callback());
                    }, (err) => {
                        if (err) {
                            return next(err);
                        }
                        return res.json({
                            status: true,
                            message: 'Calendar info added successfully'
                        });
                    });
                });
            }
            return res.json({
                status: true,
                message: 'Calendar info added successfully'
            });
        });
    });
}

module.exports = add;
