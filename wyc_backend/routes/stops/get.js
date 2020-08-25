const db = require('../../database');
const Stops = db.models.Stops;

function get(req, res, next) {
    Stops.findOne({
        where: { id: req.query.stop_id }
    }).then((result) => {
        res.json({
            status: true,
            message: 'stop info get successfuly',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = get;
