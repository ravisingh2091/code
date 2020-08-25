const utils = require('../../lib/utils');
const db = require('../../database');
const Weekoff = db.models.WeekOff;

function add(req, res, next) {
    const weekoff = {
        calendar_id: req.body.calendar_id,
        date: utils.formatDate(req.body.weekoff_date)
    };
    Weekoff.findOrCreate({
        defaults: weekoff,
        where: weekoff
    }).then((result) => {
        if (result[1]) {
            return res.json({
                status: true,
                message: 'Weekoff assign to calendar successfully'
            });
        } else {
            res.json({
                status: false,
                message: 'Weekoff already exist in same calendar'
            });
        }
    }).catch((err) => {
        next(err);
    });
}

module.exports = add;
