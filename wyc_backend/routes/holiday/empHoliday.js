const calendar = require('../../common/calendar');

function getEmpHoliday(req, res, next) {
    const employee_id = req.query.emp_id;

    calendar.getEmployeeCalendar(employee_id).then((empCalendarId) => {
        if (empCalendarId) {
            return calendar.getCalendarHoliday(empCalendarId).then((result) => {
                res.status(200).json({
                    status: true,
                    message: 'holiday listed successfully',
                    data: result
                });
            });
        }
        res.status(200).json({
            status: false,
            message: 'Employee calendar not allocated'
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = getEmpHoliday;
