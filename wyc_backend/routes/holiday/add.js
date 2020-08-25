const utils = require('../../lib/utils');
const db = require('../../database');
const Holiday = db.models.Holiday;

function add(req, res, next) {
    const data = req.body;
    const no_of_days = utils.noOfDays(data.start_date, data.end_date);

    Holiday.findOrCreate({
        defaults: {
            session_id: data.session_id,
            name: data.name,
            start_date: utils.formatDate(data.start_date),
            end_date: utils.formatDate(data.end_date),
            no_of_days: no_of_days
        },
        where: {
            session_id: data.session_id,
            name: data.name
        }
    }).then((holiday) => {
        if (holiday[1]) {
            return res.json({
                status: true,
                message: 'Holiday created successfully'
            });
        }
        res.json({
            status: false,
            message: 'Holiday already exits'
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = add;
