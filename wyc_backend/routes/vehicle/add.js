const utils = require('../../lib/utils');
const db = require('../../database');
const Vehicle = db.models.Vehicle;

function add(req, res, next) {
    const data = req.body;
    Vehicle.findOne({ where: { reg_no: data.reg_no } }).then((validRegNo) => {
        if (!validRegNo) {
            return Vehicle.findOrCreate({
                defaults: {
                    branch_id: req.query.branch_id,
                    name: data.name,
                    reg_no: data.reg_no,
                    no_of_seat: data.no_of_seat,
                    purchanse_date: utils.formatDate(data.purchanse_date),
                    renew_date: utils.formatDate(data.renew_date),
                    insurance_expiry_date: utils.formatDate(data.insurance_expiry_date),
                    last_service_date: data.last_service_date ? utils.formatDate(data.last_service_date) : null,
                    puc_expiry_date: data.puc_expiry_date ? utils.formatDate(data.puc_expiry_date) : null,
                    service_reading: data.service_reading,
                    meter_reading: data.meter_reading,
                    password: data.password,
                    description: data.description
                },
                where: {
                    branch_id: req.query.branch_id,
                    name: data.name
                }
            }).then((vehicleInfo) => {
                if (vehicleInfo[1]) {
                    res.json({
                        status: true,
                        message: 'Vehicle added successfully'
                    });
                } else {
                    res.json({
                        status: false,
                        message: 'Vehicle name already exists'
                    });
                }
            });
        } else {
            res.json({
                status: false,
                message: 'Vehicle reg no already exists'
            });
        }
    }).catch((err) => {
        next(err);
    });
}

module.exports = add;
