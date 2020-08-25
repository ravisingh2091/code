const utils = require('../../lib/utils');
const db = require('../../database');
const Session = db.models.Session;

function add(req, res, next) {
    const data = req.body;
    const branch_id = req.query.branch_id;
    const start_date = utils.formatDate(data.start_date);
    const end_date = utils.formatDate(data.end_date);

    Session.findOne({
        where: {
            branch_id: branch_id,
            status: 'Present'
        }
    }).then((presentSection) => {
        if (presentSection) {
            return Session.findOne({
                where: {
                    branch_id: branch_id,
                    status: 'Future'
                }
            }).then((futureValidation) => {
                if (!futureValidation) {
                    if (utils.formatDate(presentSection.end_date) < utils.formatDate(start_date)) {
                        return Session.create({
                            branch_id: branch_id,
                            name: data.name,
                            start_date: start_date,
                            end_date: end_date,
                            status: 'Future'
                        }).then((data) => {
                            res.json({
                                status: true,
                                message: 'Future session created',
                                data: data
                            });
                        });
                    } else {
                        return res.json({
                            status: false,
                            message: 'Start date is less then present session end date'
                        });
                    }
                } else {
                    res.json({
                        status: false,
                        message: 'Already future session created'
                    });
                }
            });
        } else {
            return Session.create({
                branch_id: branch_id,
                name: data.name,
                start_date: start_date,
                end_date: end_date,
                status: 'Present'
            }).then((data) => {
                res.json({
                    status: true,
                    message: 'Present session created',
                    data: data
                });
            });
        }
    }).catch((err) => {
        next(err);
    });
}

module.exports = add;
