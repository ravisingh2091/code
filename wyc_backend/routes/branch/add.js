const fs = require('fs');
const commonSchool = require('../../common/school');
const commonEmp = require('../../common/employee');
const message = require('../../common/message');
const db = require('../../database');
const Branch = db.models.Branch;

function add(req, res, next) {
    const data = req.body;
    Branch.findOne({ where: { school_id: data.school_id, branch: data.branch } }).then((branchInfo) => {
        if (!branchInfo) {
            return commonEmp.employeeExist(data.contact_no).then((emp) => {
                if (!emp) {
                    return commonSchool.addBranch(data).then((branch) => {
                        return commonEmp.addEmployee(data, branch.id).then((newEmployee) => {
                            return commonEmp.empProfession(data, branch.id, newEmployee.id).then(() => {
                                return commonSchool.addUser(data, newEmployee.id, 'Employee').then(() => {
                                    message.welcomeMessage(data.contact_no);
                                    if (data.logo) {
                                        const image_name = branch.id + '.jpg';
                                        const path = './images/logo/' + image_name;
                                        return fs.writeFile(path, data.logo, 'base64', function (err) {
                                            if (err) {
                                                return console.log(err);
                                            }
                                            Branch.update({ logo: image_name }, { where: { id: branch.id } }).then(() => {
                                                res.json({
                                                    status: true,
                                                    message: 'Branch created successfully',
                                                    data: { id: newEmployee.id }
                                                });
                                            });
                                        });
                                    }
                                    return res.json({
                                        status: true,
                                        message: 'Branch created successfully',
                                        data: { id: newEmployee.id }
                                    });
                                });
                            });
                        });
                    });
                } else {
                    if (!emp.status) {
                        return commonSchool.addBranch(data).then((branch) => {
                            return commonEmp.updateEmployee(data, branch.id, emp.id, 2).then(() => {
                                return commonEmp.empProfession(data, branch.id, emp.id).then(() => {
                                    return commonSchool.updateUser(data.contact_no, emp.id, 'Employee').then(() => {
                                        message.welcomeMessage(data.contact_no);
                                        if (data.logo) {
                                            const image_name = branch.id + '.jpg';
                                            const path = './images/logo/' + image_name;
                                            return fs.writeFile(path, data.logo, 'base64', function (err) {
                                                if (err) {
                                                    return console.log(err);
                                                }
                                                Branch.update({ logo: image_name }, { where: { id: branch.id } }).then(() => {
                                                    res.json({
                                                        status: true,
                                                        message: 'Branch created successfully',
                                                        data: { id: emp.id }
                                                    });
                                                });
                                            });
                                        }
                                        return res.json({
                                            status: true,
                                            message: 'Branch created successfully',
                                            data: { id: emp.id }
                                        });
                                    });
                                });
                            });
                        });
                    }
                    return res.json({
                        status: false,
                        message: 'Admin contact no already exists'
                    });
                }
            });
        }
        return res.json({
            status: false,
            message: 'Branch name already exist same school'
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = add;
