const db = require('../../database');
const FuelConsumption = db.models.FuelConsumption;

function del(req, res, next) {
    FuelConsumption.destroy({ where: { id: req.query.id } }).then(() => {
        res.json({
            status: true,
            message: 'Fuel consumption deleted successfully'
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = del;
