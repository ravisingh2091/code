const utils = require('../../lib/utils');
const transport = require('../../common/transport');
const commonSchool = require('../../common/school');
const db = require('../../database');
const FuelConsumption = db.models.FuelConsumption;

function add(req, res, next) {
    const data = req.body;


    console.log(data);
    if (data.branch_id) {
        commonSchool.getBranchSession(data.branch_id).then((sessionInfo) => {
            if (sessionInfo) {
                return FuelConsumption.create({
                    session_id: sessionInfo.id,
                    vehicle_id: data.vehicle_id,
                    date: utils.formatDate(data.date),
                    quantity: data.quantity,
                    amount: data.amount,
                    current_reading: data.current_reading,
                    driver: data.driver,
                    added_by: data.added_by,
                    description: data.description
                }).then(() => {
                    return transport.updateVehicleReading(data.vehicle_id, data.current_reading).then(() => {
                        res.json({
                            status: true,
                            message: 'Fuel consumption added successfully'
                        });
                    });
                });
            }
            res.json({
                status: false,
                message: 'No session found'
            });
        }).catch((err) => {
            next(err);
        });
    } else {
        FuelConsumption.create({
            session_id: data.session_id,
            vehicle_id: data.vehicle_id,
            date: utils.formatDate(data.date),
            quantity: data.quantity,
            amount: data.amount,
            current_reading: data.current_reading,
            driver: data.driver,
            added_by: data.added_by,
            description: data.description
        }).then(() => {
            return transport.updateVehicleReading(data.vehicle_id, data.current_reading).then(() => {
                res.json({
                    status: true,
                    message: 'Fuel consumption added successfully'
                });
            });
        }).catch((err) => {
            next(err);
        });
    }
}

module.exports = add;
