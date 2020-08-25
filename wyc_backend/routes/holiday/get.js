const db = require('../../database');
const Holiday = db.models.Holiday;

function get(req, res, next) {
    Holiday.findById(req.params.holiday_id).then((result) => {
        res.json({
            status: true,
            message: 'Holiday get successfully',
            data:result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = get;
