const Sequelize = require('sequelize');
const utils = require('../../lib/utils');
const db = require('../../database');
const FeePayment = db.models.FeePayment;
const StudentSection = db.models.StudentSection;
const Section = db.models.Section;
const Class = db.models.Class;
const Session = db.models.Session;
const Student = db.models.Student;
const Parent = db.models.Parent;

function list(req, res, next) {
    const whereCondition = {
        '$studentSection.session.branch_id$': req.query.branch_id,
    };

    if (req.query.from_date && req.query.to_date) {
        whereCondition.payment_date = {
            $between: [utils.formatDate(req.query.from_date), utils.formatDate(req.query.to_date)],
        };
    }

    if (req.query.search) {
        whereCondition.$or = [
            Sequelize.where(Sequelize.fn('concat', Sequelize.col('studentSection.student.first_name'), ' ', Sequelize.col('studentSection.student.last_name')), {
                like: req.query.search + '%'
            }),
            { id: req.query.search },
            { '$studentSection.student.first_name$': { $like: req.query.search + '%' } },
        ];
    }

    FeePayment.findAll({
        include: [{
            required: true,
            attributes: ['id'],
            model: StudentSection,
            as: 'studentSection',
            include: [{
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
                attributes: ['id', 'name', 'status'],
                model: Session,
                as: 'session'
            },
            {
                required: true,
                attributes: ['id', 'first_name', 'last_name', 'photo'],
                model: Student,
                as: 'student',
                include:[{
           required: true,
           attributes: ['id', 'contact_no','father_name'],
           model: Parent,
           as: 'parent',
            }]
            }]
        }],
        where: whereCondition
    }).then((result) => {
        res.json({
            status: true,
            message: 'Payment listed successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = list;
