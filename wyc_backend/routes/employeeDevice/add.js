const db = require('../../database');
const EmployeeDevice = db.models.EmployeeDevice;

function add(req, res, next) {
    const employee_id = req.query.employee_id;
    const data = req.body;

    EmployeeDevice.findOne({
        where: {
            employee_id: employee_id,
            imei: data.imei
        }
    }).then((device) => {
        if (!device) {
            return EmployeeDevice.create({
                employee_id: employee_id,
                device_token: data.device_token,
                imei: data.imei
            }).then(() => {
                res.json({
                    status: true,
                    message: 'Device info added successfully'
                });
            });
        }
        EmployeeDevice.update({
            device_token: data.device_token,
            status: 1
        }, { where: { id: device.id } }).then(() => {
            res.json({
                status: true,
                message: 'Device info updated successfully'
            });
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = add;
