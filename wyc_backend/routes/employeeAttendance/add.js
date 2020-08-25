const
    async = require('async'),
    utils = require('../../lib/utils'),
    db = require('../../database'),
    EmployeeAttendance = db.models.EmployeeAttendance,
    Branch = db.models.Branch;

function add(req, res, next) {
    const created_by = req.query.employee_id || '';
    async.eachSeries(req.body, (element, cb) => {
        const date = utils.formatDate(element.date);
        EmployeeAttendance.findOrCreate({
            defaults: {
                employee_id: element.emp_id,
                date,
                in_time: element.in_time,
                out_time: element.out_time,
                created_by
            },
            where: {
                employee_id: element.emp_id,
                date
            }
        }).then(() => cb());
    }, (err) => {
        if (err) {
            next(err);
        }
        res.json({
            status: true,
            message: 'employee attendance added successfully'
        });
    });
}

module.exports = add;
