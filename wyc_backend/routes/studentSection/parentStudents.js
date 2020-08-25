const db = require('../../database');
const StudentSection = db.models.StudentSection;
const Student = db.models.Student;
const Parent = db.models.Parent;
const Section = db.models.Section;
const Class = db.models.Class;
const Session = db.models.Session;
const Branch = db.models.Branch;
const School = db.models.School;
const RouteStop = db.models.RouteStop;
const RouteVehicle = db.models.RouteVehicle;
const Stops = db.models.Stops;
const Vehicle = db.models.Vehicle;
const Route = db.models.Route;

function getParentChildren(req, res, next) {
    const parentId = req.query.parent_id;

    StudentSection.findAll({
        attributes: ['id', 'roll_no'],
        include: [
            {
                required: true,
                attributes: ['id', 'first_name', 'last_name', 'dob', 'gender', 'aadhar_no', 'photo', 'id_proof', 'admission_date', 'mode_of_transport'],
                model: Student,
                as: 'student',
                include: [{
                    required: true,
                    model: Parent,
                    as: 'parent'
                }, {
                    attributes: ['id'],
                    model: RouteStop,
                    as: 'routeStop',
                    include: [{
                        attributes: ['id', 'name', 'stu_one_fee', 'stu_both_fee'],
                        model: Stops,
                        as: 'stops',
                    }]
                }, {
                    attributes: ['id'],
                    model: RouteVehicle,
                    as: 'routeVehicle',
                    include: [{
                        attributes: ['id', 'reg_no', 'name'],
                        model: Vehicle,
                        as: 'vehicle',
                    }, {
                        attributes: ['id', 'name'],
                        model: Route,
                        as: 'route',
                    }]
                }]
            },
            {
                required: true,
                attributes: ['id', 'name'],
                model: Section,
                as: 'section',
                include: [{
                    required: true,
                    attributes: ['id', 'name'],
                    model: Class,
                    as: 'class'
                }]
            },
            {
                required: true,
                attributes: ['id', 'name', 'start_date', 'end_date'],
                model: Session,
                as: 'session',
                include: {
                    required: true,
                    attributes: ['id', 'branch', 'principal_name', 'email', 'primary_no', 'affiliation_no', 'logo', 'website',
                        'street', 'city', 'state', 'country', 'pincode', 'latitude', 'longitude', 'account_name', 'merchant_id', 'merchant_key', 'marchant_salt',
                        'trans_account_name', 'trans_merchant_id', 'trans_merchant_key', 'trans_marchant_salt', 'description'],
                    model: Branch,
                    as: 'branch',
                    include: {
                        required: true,
                        attributes: ['id', 'name'],
                        model: School,
                        as: 'school'
                    }
                }
            }],
        where: {
            status: 'STUDYING',
            '$student.parent_id$': parentId
        }
    }).then((data) => {
        const studentInfo = [];
        data.forEach((student) => {
            student = student.get();
            studentInfo.push({
                id: student.id,
                roll_no: student.roll_no,
                student: {
                    id: student.student.id,
                    first_name: student.student.first_name,
                    last_name: student.student.last_name,
                    dob: student.student.dob,
                    gender: student.student.gender,
                    aadhar_no: student.student.aadhar_no,
                    category: student.student.category,
                    photo: student.student.photo,
                    id_proof: student.student.id_proof,
                    admission_date: student.student.admission_date,
                    mode_of_transport: student.student.mode_of_transport
                },
                parent: student.student.parent,
                transportInfo: student.student.mode_of_transport === 'Bus' ? {
                    vehicleInfo: student.student.routeVehicle,
                    stopInfo: student.student.routeStop,
                } : null,
                class: student.section.class,
                section: {
                    section_id: student.section.id,
                    name: student.section.name
                },
                branch: {
                    id: student.session.branch.id,
                    branch: student.session.branch.branch,
                    principal_name: student.session.branch.principal_name,
                    email: student.session.branch.email,
                    primary_no: student.session.branch.primary_no,
                    affiliation_no: student.session.branch.affiliation_no,
                    logo: student.session.branch.logo,
                    website: student.session.branch.website,
                    street: student.session.branch.street,
                    city: student.session.branch.city,
                    state: student.session.branch.state,
                    country: student.session.branch.country,
                    pincode: student.session.branch.pincode,
                    latitude: student.session.branch.latitude,
                    longitude: student.session.branch.longitude,
                    account_name: student.session.branch.account_name,
                    merchant_id: student.session.branch.merchant_id,
                    merchant_key: student.session.branch.merchant_key,
                    marchant_salt: student.session.branch.marchant_salt,
                    trans_account_name: student.session.branch.trans_account_name,
                    trans_merchant_id: student.session.branch.trans_merchant_id,
                    trans_merchant_key: student.session.branch.trans_merchant_key,
                    trans_marchant_salt: student.session.branch.trans_marchant_salt,
                    description: student.session.branch.description
                },
                school: {
                    id: student.session.branch.school.id,
                    name: student.session.branch.school.name
                },
                session: {
                    id: student.session.id,
                    name: student.session.name,
                    start_date: student.session.start_date,
                    end_date: student.session.end_date
                }
            });
        });

        res.json({
            status: true,
            message: 'Parent students listed successfully',
            parentStudent: studentInfo
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = getParentChildren;
