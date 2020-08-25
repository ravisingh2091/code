const calendar = require('../../common/calendar');

function getEmpWeekOff(req, res, next) {
    const employee_id = req.query.emp_id;

    calendar.getEmployeeCalendar(employee_id).then((empCalendarId) => {
        console.log(empCalendarId, '---------');
        if (empCalendarId) {
            return calendar.getCalendarWeekOff(empCalendarId).then((result) => {
                res.status(200).json(result);
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

module.exports = getEmpWeekOff;
