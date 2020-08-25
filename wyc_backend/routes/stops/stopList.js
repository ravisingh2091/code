const db = require('../../database');
const Stops = db.models.Stops;

function list(req, res, next) {
    Stops.findAll({
        where: { branch_id: req.query.branch_id }
    }).then((result) => {
        res.json({
            status: true,
            message: 'Stops listed successfuly',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = list;
