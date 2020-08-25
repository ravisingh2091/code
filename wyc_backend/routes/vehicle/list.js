const db = require('../../database');
const Vehicle = db.models.Vehicle;

function get(req, res, next) {
    Vehicle.findAll({
        where: { branch_id: req.query.branch_id }
    }).then((result) => {
        res.json({
            status: true,
            message: 'Vehicle info listed successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = get;
