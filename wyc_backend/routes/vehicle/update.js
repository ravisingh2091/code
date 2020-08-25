const utils = require('../../lib/utils');
const db = require('../../database');
const Vehicle = db.models.Vehicle;

function update(req, res, next) {
    const data = req.body;

    if (!data.vehicle_status) {
        Vehicle.findOne({ where: { reg_no: data.reg_no, id: { $ne: data.id } } }).then((validRegNo) => {
            if (!validRegNo) {
                return Vehicle.findOne({ where: { name: data.name, id: { $ne: data.id } } }).then((vehicleInfo) => {
                    if (!vehicleInfo) {
                        return Vehicle.update({
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
                        }, { where: { id: data.id } }).then(() => {
                            res.json({
                                status: true,
                                message: 'Vehicle updated successfully'
                            });
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
    } else {
        const updateData = {};
        if (data.vehicle_status) {
            updateData.vehicle_status = data.vehicle_status;
        }

        if (data.latitude && data.longitude) {
            updateData.latitude = data.latitude;
            updateData.longitude = data.longitude;
        }

        Vehicle.update(updateData, { where: { id: data.id } }).then(() => {
            res.json({
                status: true,
                message: 'Vehicle status updated successfully'
            });
        });
    }
}

module.exports = update;
