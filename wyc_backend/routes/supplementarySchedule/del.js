const db = require('../../database');
const SupplementarySchedule = db.models.SupplementarySchedule;

function del(req, res, next) {
    SupplementarySchedule.destroy({ where: { id: req.query.id } }).then(() => {
        res.json({
            status: true,
            message: 'Supplementary schedule deleted successfully'
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = del;
