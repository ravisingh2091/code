const db = require('../../database');
const Stops = db.models.Stops;

function list(req, res, next) {
    Stops.findAll({
        where: { branch_id: req.query.branch_id },
        order: 'name'
    }).then((result) => {
        res.json({
            status: true,
            message: 'stop listed successfuly',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = list;
