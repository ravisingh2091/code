const async = require('async');
const employee = require('../../common/employee');
const school = require('../../common/school');
const message = require('../../common/message');

function add(req, res, next) {
    const branch_id = req.query.branch_id;
    const employess = req.body;
    let duplicateStatus = false;

    async.eachSeries(employess, (data, callback) => {
        return employee.employeeExist(data.contact_no).then((emp) => {
            if (!emp) {
                return employee.addEmployee(data, branch_id).then((newEmployee) => {
                    return employee.empProfession(data, branch_id, newEmployee.id).then(() => {
                        return school.addUser(data, newEmployee.id, 'Employee').then(() => {
                            message.welcomeMessage(employee.contact_no, branch_id);
                            callback();
                        });
                    });
                });
            } else {
                if (!emp.status) {
                    return employee.updateEmployee(data, branch_id, emp.id).then(() => {
                        return employee.empProfession(data, branch_id, emp.id).then(() => {
                            return school.updateUser(data.contact_no, emp.id, 'Employee').then(() => {
                                message.welcomeMessage(data.contact_no, branch_id);
                                callback();
                            });
                        });
                    });
                } else {
                    duplicateStatus = true;
                    callback();
                }
            }
        });
    }, (err) => {
        if (err) {
            return next(err);
        }
        let message = 'Employees uploaded successfully';
        if (duplicateStatus) {
            message = 'some entries have been skipped due to duplicate date';
        }
        res.json({
            status: true,
            message
        });
    });
}

module.exports = add;
