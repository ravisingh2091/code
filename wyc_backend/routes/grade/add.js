const async = require('async');
const db = require('../../database');
const Grade = db.models.Grade;

function add(req, res, next) {
    Grade.findOne({ where: { branch_id: req.query.branch_id } }).then((gradeInfo) => {
        if (!gradeInfo) {
            return async.eachSeries(req.body, (element, callback) => {
                return Grade.findOrCreate({
                    defaults: {
                        branch_id: req.query.branch_id,
                        from_mark: element.from_mark,
                        to_mark: element.to_mark,
                        grade: element.grade
                    },
                    where: {
                        branch_id: req.query.branch_id,
                        grade: element.grade
                    }
                }).then(() => {
                    return callback();
                });
            }, (err) => {
                if (err) {
                    next(err);
                }
                res.json(201, {
                    status: true,
                    message: 'Grades created successfully'
                });
            });
        } else {
            return res.json({
                status: t,
                message: 'Grades already exist'
            });
        }
    });
}

module.exports = add;
