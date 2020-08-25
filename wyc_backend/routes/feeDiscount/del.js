const db = require('../../database');
const FeeDiscount = db.models.FeeDiscount;

function del(req, res, next) {
    FeeDiscount.destroy({
        where: {
            id: req.query.id,
            status: '0'
        }
    }).then(() => {
        res.json({
            status: true,
            message: req.query.fee_type + ' deleted successfully'
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = del;
