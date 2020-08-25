const employee = require('../../common/employee');
const school = require('../../common/school');
const message = require('../../common/message');

function add(req, res, next) {
    const branch_id = req.query.branch_id;
    const data = req.body;
    employee.employeeExist(data.contact_no).then((emp) => {
        if (!emp) {
            return employee.addEmployee(data, branch_id).then((newEmployee) => {
                return employee.empProfession(data, branch_id, newEmployee.id).then(() => {
                    return school.addUser(data, newEmployee.id, 'Employee').then(() => {
                        message.welcomeMessage(data.contact_no, branch_id);
                        res.json({
                            status: true,
                            message: 'Employee created successfully',
                            data: { id: newEmployee.id }
                        });
                    });
                });
            });
        } else {
            if (!emp.status) {
                return employee.updateEmployee(data, branch_id, emp.id).then(() => {
                    return employee.empProfession(data, branch_id, emp.id).then(() => {
                        return school.updateUser(data.contact_no, emp.id, 'Employee').then(() => {
                            message.welcomeMessage(data.contact_no, branch_id);
                            res.json({
                                status: true,
                                message: 'Employee created successfully',
                                data: { id: emp.id }
                            });
                        });
                    });
                });
            } else {
                return res.json({
                    status: false,
                    message: 'Employee contact no already exists'
                });
            }
        }
    }).catch((err) => {
        next(err);
    });
}

module.exports = add;
