const db = require('../../database');
const House = db.models.House;

function get(req, res, next) {
    House.findAll({
        where: {
            branch_id: req.query.branch_id
        }
    }).then((result) => {
        res.json({
            status: true,
            message: 'House listed successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = get;
