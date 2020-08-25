const db = require('../../database');
const Route = db.models.Route;

function get(req, res, next) {
    Route.findById(req.query.id).then((result) => {
        res.json({
            status: true,
            message: 'Route info get successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = get;
