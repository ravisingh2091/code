const db = require('../../database');
const EmployeeProfessionalInfo = db.models.EmployeeProfessionalInfo;
const Employee = db.models.Employee;
const UserType = db.models.UserType;

function employee(req, res, next) {
    const whereCondition = {
        branch_id: req.query.branch_id
    };

    if(req.query.status){
        whereCondition['$employee.status$'] = req.query.status;
    }

    if (req.query.type_id) {
        if (req.query.type_id === '1' || req.query.type_id === '2') {
            delete whereCondition.branch_id;
        }
        whereCondition['$employee.type_id$'] = req.query.type_id;
    } else {
        whereCondition['$employee.type_id$'] = {
            $in: [3, 4]
        };
    }
    
    if (req.query.transport) {
        whereCondition['$employee.mode_of_transport$'] = req.query.transport;
    }

    if (req.query.calendar) {
        if (req.query.calendar === 'Assign') {
            whereCondition['$employee.calendar_id$'] = {
                $ne: null
            };
        } else {
            whereCondition['$employee.calendar_id$'] = {
                $eq: null
            };
        }
    }

    EmployeeProfessionalInfo.findAll({
        include: [{
            required: true,
            model: Employee,
            as: 'employee',
            include: [{
                required: true,
                model: UserType,
                as: 'userType'
            }],
        }],
        where: whereCondition,
        order: ['first_name', 'last_name']
    }).then((employee) => {
        const result = [];
        employee.forEach(element => {
            result.push({
                id: element.employee.id,
                branch_id: element.employee.branch_id,
                first_name: element.employee.first_name,
                last_name: element.employee.last_name,
                father_name: element.employee.father_name,
                husband_name: element.employee.husband_name,
                contact_no: element.employee.contact_no,
                email: element.employee.email,
                dob: element.employee.dob,
                gender: element.employee.gender,
                aadhar_no: element.employee.aadhar_no,
                id_proof: element.employee.id_proof,
                barcode: element.employee.barcode,
                mode_of_transport: element.employee.mode_of_transport,
                route_stop_id: element.employee.route_stop_id,
                route_vehicle_id: element.employee.route_vehicle_id,
                slot: element.employee.slot,
                transport_type: element.employee.transport_type,
                trans_enable_date: element.employee.trans_enable_date,
                qualification: element.employee.qualification,
                blood_group: element.employee.blood_group,
                religion: element.employee.religion,
                category: element.employee.category,
                nationality: element.employee.nationality,
                street: element.employee.street,
                city: element.employee.city,
                state: element.employee.state,
                country: element.employee.country,
                pincode: element.employee.pincode,
                photo_no: element.employee.photo_no,
                photo: element.employee.photo,
                calendar_id: element.employee.calendar_id,
                status: element.employee.status,
                designation: element.designation,
                joining_date: element.joining_date,
                experience: element.experience,
                salary: element.salary,
                feedback: element.feedback,
                userType: {
                    id: element.employee.userType.id,
                    name: element.employee.userType.name
                }
            });
        });

        res.json({
            status: true,
            message: 'Employee Info listed successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = employee;
