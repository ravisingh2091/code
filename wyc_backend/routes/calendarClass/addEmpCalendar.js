const async = require('async');
const db = require('../../database');
const Employee = db.models.Employee;

function employeeCalendar(req, res, next) {
    async.eachSeries(req.body.options, (assign, callback) => {
        Employee.update({ calendar_id: assign.calendar_id }, { where: { id: assign.id } }).then(() => callback());
    }, (err) => {
        if (err) {
            return next(err);
        }
        res.json(201, {
            status: true,
            message: 'Employee calendar assign successfully'
        });
    });
}

module.exports = employeeCalendar;
