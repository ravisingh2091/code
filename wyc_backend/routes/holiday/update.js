const commonCalendar = require('../../common/calendar');
const utils = require('../../lib/utils');
const db = require('../../database');
const Holiday = db.models.Holiday;

function update(req, res, next) {
    const data = req.body;

    Holiday.find({
        where: {
            session_id: data.session_id,
            name: data.name,
            $not: {
                id: data.id
            }
        }
    }).then((holiday) => {
        if (!holiday) {
            const no_of_days = utils.noOfDays(data.start_date, data.end_date);
            return Holiday.update({
                session_id: data.session_id,
                name: data.name,
                start_date: data.start_date,
                end_date: data.end_date,
                no_of_days: no_of_days
            }, { where: { id: data.id } }).then(() => {
                return commonCalendar.sendHolidayUpdate(data.id).then(() => {
                    res.json({
                        status: true,
                        message: 'Holiday updated successfully'
                    });
                });
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

module.exports = update;
