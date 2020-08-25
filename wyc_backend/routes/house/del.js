const db = require('../../database');
const House = db.models.House;

function del(req, res, next) {
    House.destroy({ where: { id: req.params.id } }).then(() => {
        res.json({
            status: true,
            message: 'house deleted successfully'
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = del;
