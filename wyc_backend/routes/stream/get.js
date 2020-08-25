const db = require('../../database');
const Stream = db.models.Stream;

function get(req, res, next) {
    Stream.findOne({ where: { id: req.params.id } }).then((result) => {
        res.json({
            status: true,
            message: 'Stream get successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = get;
