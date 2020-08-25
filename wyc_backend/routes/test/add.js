const db = require('../../database');
const Test = db.models.Test;

function add(req, res, next) {
    Test.findOrCreate({
        defaults: {
            branch_id: req.query.branch_id,
            name: req.body.name
        },
        where: {
            branch_id: req.query.branch_id,
            name: req.body.name
        }
    }).then((result) => {
        if (result[1]) {
            res.json({
                status: true,
                message: 'Test added successfully'
            });
        } else {
            res.json({
                status: false,
                message: 'Test name already exist'
            });
        }
    }).catch((err) => {
        next(err);
    });
}

module.exports = add;
