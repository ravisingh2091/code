const db = require('../../database');
const Test = db.models.Test;

function get(req, res, next) {
    Test.findById(req.query.id).then((result) => {
        res.json({
            status: true,
            message: 'Test info get successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = get;
