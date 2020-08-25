const utils = require('../../lib/utils');
const db = require('../../database');
const Session = db.models.Session;

function update(req, res, next) {
    const branch_id = req.query.branch_id;
    const data = req.body;

    const updateQuery = {
        name: data.name,
        start_date: data.start_date,
        end_date: data.end_date
    };

    if (data.status === 'Future') {
        Session.find({
            branch_id: branch_id,
            status: 'Present'
        }).then((session) => {
            if (utils.formatDate(session.end_date) < data.start_date) {
                return Session.update(updateQuery, { where: { id: data.id } }).then(() => {
                    res.json({
                        status: true,
                        message: 'Future session updated'
                    });
                });
            }
            res.json({
                status: false,
                message: 'Start date is less then present session end date'
            });
        }).catch((err) => {
            next(err);
        });
    } else {
        Session.update(updateQuery, { where: { id: data.id } }).then(() => {
            res.json({
                status: true,
                message: 'Present session updated'
            });
        }).catch((err) => {
            next(err);
        });
    }
}

module.exports = update;
