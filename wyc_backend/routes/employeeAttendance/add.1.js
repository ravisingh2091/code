const utils = require('../../lib/utils');
const db = require('../../database');
const BiometricDevice = db.models.BiometricDevice;
const Employee = db.models.Employee;
const EmployeeAttendance = db.models.EmployeeAttendance;

function add(req, res, next) {
    const data = req.query;

    BiometricDevice.findOne({
        where: {
            device_id: data.stgid
        }
    }).then((deviceInfo) => {
        if (deviceInfo) {
            return Employee.findOne({
                where: {
                    branch_id: deviceInfo.branch_id,
                    biometric_id: data.userid
                }
            }).then((empInfo) => {
                if (empInfo) {
                    const date = utils.formatDate(new Date(data.att_time * 1000));
                    const time = utils.formatDate(new Date(data.att_time * 1000), 'HH:mm:ss');

                    return EmployeeAttendance.findOrCreate({
                        defaults: {
                            employee_id: empInfo.id,
                            date,
                            in_time: time
                        },
                        where: {
                            employee_id: empInfo.id,
                            date
                        }
                    }).then((empAttendance) => {
                        if (empAttendance[1]) {
                            return res.send('ok');
                            // return res.json({
                            //     status: true,
                            //     message: 'Employee IN attendance added successfully'
                            // });
                        }
                        return EmployeeAttendance.update({ out_time: time }, { where: { id: empAttendance[0].id } }).then(() => {
                            res.send('ok');
                           
                            // res.json({
                            //     status: true,
                            //     message: 'Employee OUT attendance added successfully'
                            // });
                        });
                    });
                }
                return res.json({
                    status: false,
                    message: 'No employee found'
                });
            });
        }
        return res.json({
            status: false,
            message: 'No device found'
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = add;
