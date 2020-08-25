const db = require('../../database');
const StudentSection = db.models.StudentSection;
const Session = db.models.Session;
const Student = db.models.Student;
const Parent = db.models.Parent;
const Section = db.models.Section;
const Classes = db.models.Class;

function qrCode(req, res, next) {
    StudentSection.findOne({
        attributes: ['id', 'roll_no'],
        include: [{
            required: true,
            attributes: ['id', 'admission_no', 'first_name', 'last_name', 'dob', 'gender', 'blood_group', 'house', 'photo', 'remarks'],
            model: Student,
            as: 'student',
            include: [{
                required: true,
                attributes: ['id', 'father_name', 'mother_name', 'father_no', 'mother_no', 'email', 'contact_no', 'street', 'city', 'state', 'country', 'pincode'],
                model: Parent,
                as: 'parent'
            }]
        }, {
            required: true,
            attributes: [],
            model: Session,
            as: 'session',
        }, {
            required: true,
            attributes: ['id', 'name'],
            model: Section,
            as: 'section',
            include: [{
                required: true,
                attributes: ['id', 'name'],
                model: Classes,
                as: 'class'
            }]
        }],
        where: {
            '$session.branch_id$': req.query.branch_id,
            '$student.barcode$': req.params.barcode
        }
    }).then((studentInfo) => {
        if (studentInfo) {
            return res.json({
                status: true,
                message: 'Student info get successfully',
                data: studentInfo
            });
        }
        res.json({
            status: false,
            message: 'No Student Found'
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = qrCode;
