const async = require('async');
const utils = require('../../lib/utils');
const db = require('../../database');
const Employee = db.models.Employee;

function allocationTeacher(req, res, next) {
    async.eachSeries(req.body, (employee, callback) => {
        Employee.update({
            route_stop_id: employee.route_stop_id,
            route_vehicle_id: employee.route_vehicle_id,
            slot: employee.slot,
            transport_type: employee.type,
            trans_enable_date: utils.formatDate(employee.trans_enable_date)
        }, { where: { id: employee.employee_id } }).then(() => {
            callback();
        });
    }, (err) => {
        if (err) {
            next(err);
        }
        res.json({
            status: true,
            message: 'Teachers stop allocated successfully'
        });
    });
}

module.exports = allocationTeacher;
