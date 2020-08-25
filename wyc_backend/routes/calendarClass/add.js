const async = require('async');
const db = require('../../database');
const CalendarClass = db.models.CalendarClass;

function add(req, res, next) {
    async.eachSeries(req.body.options, (assign, callback) => {
        if (assign.id) {
            return CalendarClass.update({ calendar_id: assign.calendar_id }, { where: { id: assign.id } }).then(() => {
            }).then(() => { return callback(); });
        } else {
            return CalendarClass.findOrCreate({
                defaults: {
                    session_id: req.body.session_id,
                    class_id: assign.class_id,
                    calendar_id: assign.calendar_id
                },
                where: {
                    session_id: req.body.session_id,
                    class_id: assign.class_id
                }
            })
                .then(() => { return callback(); });
        }
    }, (err) => {
        if (err) {
            return next(err);
        }
        res.json(201, {
            status: true,
            message: 'Classes calendar assign successfully'
        });
    });
}

module.exports = add;
