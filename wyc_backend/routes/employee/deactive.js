const db = require('../../database'),
    Employee = db.models.Employee,
    EmployeePro = db.models.EmployeeProfessionalInfo,
    User = db.models.User;

function deactive(req, res, next) {
    const data = req.body;
    Promise.all([
        Employee.update({ status: 0 }, { where: { id: data.id } }),
        EmployeePro.update({ status: 0, relieving_date: data.relieving_date, feedback: data.feedback }, { where: { employee_id: data.id } }),
        User.update({ status: 0 }, { where: { user_id: data.id, type: 'Employee' } })
    ]).then(() => {
        res.json({
            status: true,
            message: 'Employee deactivted successfully'
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = deactive;
