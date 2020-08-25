const db = require('../../database');
const Driver = db.models.Driver;

function get(req, res, next) {
    Driver.findById(req.query.id).then((result) => {
        res.json({
            status: true,
            message: 'Driver info get successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = get;
