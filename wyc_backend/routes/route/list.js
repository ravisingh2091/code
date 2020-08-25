const db = require('../../database');
const Route = db.models.Route;

function get(req, res, next) {
    Route.findAll({
        where: { branch_id: req.query.branch_id }
    }).then((result) => {
        res.json({
            status: true,
            message: 'Route info listed successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = get;
