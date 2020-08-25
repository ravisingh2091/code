const db = require('../../database');
const Vehicle = db.models.Vehicle;

function get(req, res, next) {
    Vehicle.findById(req.query.id).then((result) => {
        res.json({
            status: true,
            message: 'Vehicle info get successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = get;
