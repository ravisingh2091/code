const db = require('../../database');
const TransportDiscount = db.models.TransportDiscount;

function del(req, res, next) {
    TransportDiscount.destroy({
        where: {
            id: req.query.id,
            status: '0'
        }
    }).then(() => {
        res.json({
            status: true,
            message: 'Transport discount deleted successfully'
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = del;
