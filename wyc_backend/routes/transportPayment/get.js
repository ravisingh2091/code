const db = require('../../database');
const TransportPayment = db.models.TransportPayment;
const StudentSection = db.models.StudentSection;
const Student = db.models.Student;
const Parent = db.models.Parent;
const Section = db.models.Section;
const Class = db.models.Class;
const Session = db.models.Session;
const Branch = db.models.Branch;
const School = db.models.School;

function studentPayment(req, res, next) {
    return TransportPayment.findOne({
        include: [{
            required: true,
            attributes: ['id', 'roll_no'],
            model: StudentSection,
            as: 'studentSection',
            include: [{
                required: true,
                attributes: ['id', 'first_name', 'last_name', 'admission_no'],
                model: Student,
                as: 'student',
                include: [{
                    required: true,
                    attributes: ['father_name', 'mother_name', 'contact_no', 'street', 'city', 'state', 'country', 'pincode'],
                    model: Parent,
                    as: 'parent',
                }]
            }, {
                required: true,
                attributes: ['id', 'name'],
                model: Section,
                as: 'section',
                include: [{
                    required: true,
                    attributes: ['id', 'name'],
                    model: Class,
                    as: 'class',
                }]
            }, {
                required: true,
                attributes: ['id', 'name'],
                model: Session,
                as: 'session',
                include: [{
                    required: true,
                    attributes: ['id', 'branch', 'affiliation_no', 'street', 'city', 'state', 'country', 'pincode', 'logo', 'trans_account_name'],
                    model: Branch,
                    as: 'branch',
                    include: [{
                        required: true,
                        attributes: ['id', 'name'],
                        model: School,
                        as: 'school',
                    }]
                }]
            }]
        }],
        where: {
            id: req.query.id
        },
    }).then((result) => {
        res.json({
            status: true,
            message: 'Payment info get successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = studentPayment;
