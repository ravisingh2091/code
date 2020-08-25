'use strict';
const utils = require('../lib/utils'),
 db = require('../database'),
 Employee = db.models.Employee,
 EmployeeProfessionalInfo = db.models.EmployeeProfessionalInfo;

const employee = {

    /**
     * Validate employee already exists or not
     * @param contact_no
     * @param id
     * @returns {*}
     */
    employeeExist: (contact_no, id = false) => {
        const whereCondition = { contact_no };
        if (id) {
            whereCondition.id = {
                $not: id
            };
        }
        return Employee.findOne({ attributes: ['id', 'status'], where: whereCondition }).then((employee) => {
            return employee;
        });
    },

    /**
     * Add employee info
     * @param data
     * @param branch_id
     * @param type_id
     * @returns {*}
     */
    addEmployee: (data, branch_id) => {
        const permission = JSON.stringify(data.permission)
        return Employee.create({
            branch_id: branch_id,
            first_name: utils.toTitleCase(data.first_name),
            last_name: data.last_name ? utils.toTitleCase(data.last_name) : null,
            father_name: utils.toTitleCase(data.father_name),
            husband_name: data.husband_name ? utils.toTitleCase(data.husband_name) : null,
            contact_no: data.contact_no,
            email: data.email ? data.email : null,
            dob: utils.formatDate(data.dob),
            gender: data.gender,
            aadhar_no: data.aadhar_no,
            id_proof: data.id_proof ? data.id_proof : null,
            id_proof_no: data.id_proof_no ? data.id_proof_no : null,
            barcode: data.barcode ? data.barcode : null,
            biometric_id: data.biometric_id ? data.biometric_id : null,
            mode_of_transport: data.mode_of_transport,
            qualification: data.qualification ? data.qualification : null,
            blood_group: data.blood_group ? data.blood_group : null,
            religion: data.religion ? data.religion : null,
            category: data.category ? data.category : null,
            nationality: data.nationality ? data.nationality : null,
            street: data.street ? data.street : null,
            city: data.city ? data.city : null,
            state: data.state ? data.state : null,
            country: data.country ? data.country : null,
            pincode: data.pincode ? data.pincode : null,
            photo_no: data.photo_no ? data.photo_no : null,
            type_id: data.type_id,
            permission:permission ?permission : null
        }).then((emp) => {
            return emp;
        });
    },

    /**
     * Update employee info
     * @param data
     * @param branc_id
     * @param id
     * @param type_id
     * @returns {*}
     */
    updateEmployee: (data, branch_id, id) => {
        const permission = JSON.stringify(data.permission)

        return Employee.update({
            branch_id,
            first_name: utils.toTitleCase(data.first_name),
            last_name: data.last_name ? utils.toTitleCase(data.last_name) : null,
            father_name: utils.toTitleCase(data.father_name),
            husband_name: data.husband_name ? utils.toTitleCase(data.husband_name) : null,
            // contact_no: data.contact_no,
            email: data.email ? data.email : null,
            dob: utils.formatDate(data.dob),
            gender: data.gender,
            aadhar_no: data.aadhar_no,
            id_proof: data.id_proof ? data.id_proof : null,
            id_proof_no: data.id_proof_no ? data.id_proof_no : null,
            barcode: data.barcode ? data.barcode : null,
            biometric_id: data.biometric_id ? data.biometric_id : null,
            mode_of_transport: data.mode_of_transport,
            qualification: data.qualification ? data.qualification : null,
            blood_group: data.blood_group ? data.blood_group : null,
            religion: data.religion ? data.religion : null,
            category: data.category ? data.category : null,
            nationality: data.nationality ? data.nationality : null,
            street: data.street ? data.street : null,
            city: data.city ? data.city : null,
            state: data.state ? data.state : null,
            country: data.country ? data.country : null,
            pincode: data.pincode ? data.pincode : null,
            photo_no: data.photo_no ? data.photo : null,
            permission:permission ?permission : null
        }, { where: { id } }).then(() => {
            return true;
        });
    },

    /**
     * Add or update employee profession info
     * @param data
     * @param branch_id
     * @param emp_id
     * @returns {*}
     */
    empProfession: (data, branch_id, emp_id) => {
        return employee.getEmpProfession(emp_id).then((profession) => {
            if (!profession) {
                return EmployeeProfessionalInfo.create({
                    branch_id: branch_id,
                    employee_id: emp_id,
                    designation: data.designation,
                    joining_date: data.joining_date ? utils.formatDate(data.joining_date) : null,
                    experience: data.experience,
                    salary: data.salary,
                    feedback: data.feedback
                }).then(() => {
                    return true;
                });
            } else {
                return EmployeeProfessionalInfo.update({
                    designation: data.designation,
                    joining_date: data.joining_date ? utils.formatDate(data.joining_date) : null,
                    experience: data.experience,
                    salary: data.salary,
                    feedback: data.feedback
                }, { where: { id: profession.id } }).then(() => {
                    return true;
                });
            }
        });
    },

    /**
     * Get employee Profession info
     * @param employee_id
     * @returns {*}
     */
    getEmpProfession: (employee_id) => {
        return EmployeeProfessionalInfo.findOne({ where: { employee_id, status: '1' } }).then((profession) => {
            return profession;
        });
    }
};

module.exports = employee;
