const db = require('../../database');
const CalendarClass = db.models.CalendarClass;
const Calendar = db.models.Calendar;
const Class = db.models.Class;

function get(req, res, next) {
    CalendarClass.findAll({
        attributes: ['id', 'calendar_id'],
        include: [{
            required: true,
            attributes: [],
            model: Calendar,
            as: 'calendar'
        }, {
            required: true,
            attributes: ['id', 'name'],
            model: Class,
            as: 'class'
        }],
        where: {
            '$calendar.session_id$': req.query.session_id
        },
        order: 'class.sort'
    }).then((result) => {
        res.json({
            status: true,
            message: 'Calendar class listed successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = get;
