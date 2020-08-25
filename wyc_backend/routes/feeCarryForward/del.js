const db = require('../../database');
const FeeCarryForward = db.models.FeeCarryForward;

function del(req, res, next) {
    FeeCarryForward.destroy({
        where: {
            id: req.query.id,
            status: {
                $eq: '0'
            }
        }
    }).then((carryForward) => {
        if (carryForward) {
            return res.json({
                status: false,
                message: 'Carry forward fee deleted successfully'
            });
        }
        res.json({
            status: false,
            message: 'Carry forward fee already added to invoice.'
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = del;
