const db = require('../../database');
const House = db.models.House;

function get(req, res, next) {
    House.findOne({ where: { id: req.params.id } }).then((result) => {
        res.json({
            status: true,
            message: 'House get successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = get;
