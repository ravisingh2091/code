const async = require('async');
const utils = require('../../lib/utils');
const db = require('../../database');
const Session = db.models.Session;

function sessionUpdate(req, res, next) {
    Session.findAll({
        where: {
            start_date: {
                $eq: utils.getToday()
            },
            status: 'Future'
        }
    }).then((FutureSessionList) => {
        return async.eachSeries(FutureSessionList, (element, cb) => {
            Session.update({ status: 'Past' }, { where: { branch_id: element.branch_id, status: { $ne: 'Future' } } }).then(() => {
                Session.update({ status: 'Present' }, { where: { id: element.id } }).then(() => { return cb(); });
            });
        }, (err) => {
            if (err) {
                next(err);
            }
            return res.json({
                status: true,
                message: 'Today started future session are active now'
            });
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = sessionUpdate;
