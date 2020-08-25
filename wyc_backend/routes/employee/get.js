const db = require('../../database');
const Employee = db.models.Employee;
const EmployeeProfessionalInfo = db.models.EmployeeProfessionalInfo;
const Branch = db.models.Branch;
const UserType = db.models.UserType;
const School = db.models.School;

function employee(req, res, next) {
    Employee.findOne({
        include: [{
            attributes: ['id', 'branch', 'principal_name', 'email', 'primary_no', 'affiliation_no', 'logo', 'season', 'website', 'street', 'city', 'state', 'country', 'pincode', 'latitude', 'longitude'],
            model: Branch,
            as: 'branch',
            include: {
                attributes: ['id', 'name'],
                model: School,
                as: 'school'
            }
        }, {
            required: true,
            model: UserType,
            as: 'userType'
        }],
        where: {
            id: req.params.id
        }
    }).then((employee) => {
        return EmployeeProfessionalInfo.findOne({
            where: {
                employee_id: req.params.id,
                branch_id: req.query.branch_id
            }
        }).then((employeePro) => {
            res.json({
                status: true,
                message: 'Employee Info get successfully',
                data: {
                    id: employee.id,
                    
                    first_name: employee.first_name,
                    last_name: employee.last_name,
                    father_name: employee.father_name,
                    husband_name: employee.husband_name,
                    contact_no: employee.contact_no,
                    email: employee.email,
                    dob: employee.dob,
                    gender: employee.gender,
                    aadhar_no: employee.aadhar_no,
                    id_proof: employee.id_proof,
                    id_proof_no: employee.id_proof_no,
                    barcode: employee.barcode,
                    biometric_id: employee.biometric_id,
                    mode_of_transport: employee.mode_of_transport,
                    route_stop_id: employee.route_stop_id,
                    route_vehicle_id: employee.route_vehicle_id,
                    slot: employee.slot,
                    transport_type: employee.transport_type,
                    trans_enable_date: employee.trans_enable_date,
                    qualification: employee.qualification,
                    blood_group: employee.blood_group,
                    religion: employee.religion,
                    category: employee.category,
                    nationality: employee.nationality,
                    street: employee.street,
                    city: employee.city,
                    state: employee.state,
                    permission: employee.permission,
                    country: employee.country,
                    pincode: employee.pincode,
                    photo_no: employee.photo_no,
                    photo: employee.photo,
                    status: employee.status,
                    designation: employeePro ? employeePro.designation : null,
                    joining_date: employeePro ? employeePro.joining_date : null,
                    experience: employeePro ? employeePro.experience : null,
                    salary: employeePro ? employeePro.salary : null,
                    feedback: employeePro ? employeePro.feedback : null

                },
                branch: employee.branch ?
                    {
                        id: employee.branch.id,
                        branch: employee.branch.branch,
                        principal_name: employee.branch.principal_name,
                        email: employee.branch.email,
                        primary_no: employee.branch.primary_no,
                        affiliation_no: employee.branch.affiliation_no,
                        logo: employee.branch.logo,
                        website: employee.branch.website,
                        description: employee.branch.description,
                        street: employee.branch.street,
                        city: employee.branch.city,
                        state: employee.branch.state,
                        country: employee.branch.country,
                        pincode: employee.branch.pincode,
                        latitude: employee.branch.latitude,
                        longitude: employee.branch.longitude
                    } : {},
                school: employee.branch ? employee.branch.school : {},
                type: {
                    id: employee.userType.id,
                    name: employee.userType.name
                }
            });
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = employee;
