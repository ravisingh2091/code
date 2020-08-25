const calendar = require('../../common/calendar');

function get(req, res, next) {
    const class_id = req.params.class_id;

    calendar.getClassCalendar(class_id)
        .then(calendar.getCalendarHoliday)
        .then((result) => {
            res.status(200).json({
                status: true,
                message: 'holiday listed successfully',
                data: result
            });
        })
        .catch((err) => {
            next(err);
        });
}

module.exports = get;
