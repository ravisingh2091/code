const employee = require('../../common/employee');
// const school = require('../../common/school');
const db = require('../../database');
const Employee = db.models.Employee;

/**
 * Update Employee Profile
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function update(req, res, next) {
    const branch_id = req.query.branch_id;
    const data = req.body;

    Employee.findOne({
        where: {
            contact_no: data.contact_no,
            id: {
                $not: data.id
            }
        },
    }).then((emp) => {
        if (!emp) {
            return Promise.all([
                employee.updateEmployee(data, branch_id, data.id),
                employee.empProfession(data, branch_id, data.id),
                // school.updateUser(data.contact_no, data.id, 'Employee')
            ]).then(() => {
                res.json({
                    status: true,
                    message: 'Employee info updated successfully'
                });
            });
        }
        res.json({
            status: false,
            message: 'Employee contact no already exists'
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = update;
