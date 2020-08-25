const utils = require('../../lib/utils');
const db = require('../../database');
const Employee = db.models.Employee;
const EmployeeAttendance = db.models.EmployeeAttendance;

function get(req, res, next) {
    const whereCondition = {
        '$employee.branch_id$':req.query.branch_id
    };
    
    if (req.query.emp_id) {
        whereCondition.employee_id = req.query.emp_id;
    }

    if (!req.query.date && !req.query.from_date && !req.query.to_date) {
        const from_date = utils.getMonthFirstDate();
        const to_date = utils.formatDate(new Date());

        whereCondition.date = {
            $gte: from_date,
            $lte: to_date
        };
    }

    if (req.query.date) {
        whereCondition.date = utils.formatDate(req.query.date);
    }

    if (req.query.from_date && req.query.to_date) {
        whereCondition.date = {
            $gte: utils.formatDate(req.query.from_date),
            $lte: utils.formatDate(req.query.to_date)
        };
    }

    EmployeeAttendance.findAll({
        include: [{
            attributes: ['id', 'first_name', 'last_name'],
            required: true,
            model: Employee,
            as: 'employee'
        }],
        where: whereCondition
    }).then((results) => {
        res.json({
            status: true,
            message: 'Employee Attendance listed successfully',
            data: results
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = get;
