const db = require('../../database');
const Test = db.models.Test;

function list(req, res, next) {
    Test.findAll({
        where: {
            branch_id: req.query.branch_id
        }
    }).then((result) => {
        res.json({
            status: true,
            message: 'Test listed successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = list;
