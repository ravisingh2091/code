const utils = require('../../lib/utils');
const transport = require('../../common/transport');
const db = require('../../database');
const FuelConsumption = db.models.FuelConsumption;

function add(req, res, next) {
    const data = req.body;

    FuelConsumption.update({
        vehicle_id: data.vehicle_id,
        date: utils.formatDate(data.date),
        quantity: data.quantity,
        amount: data.amount,
        current_reading: data.current_reading,
        description: data.description
    }, { where: { id: data.id } }).then(() => {
        return transport.updateVehicleReading(data.vehicle_id, data.current_reading).then(() => {
            res.json({
                status: true,
                message: 'Fuel consumption updated successfully'
            });
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = add;
