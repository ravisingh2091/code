const Sequelize = require('sequelize');
 utils = require('../../lib/utils');
 db = require('../../database');
 FeeInvoice = db.models.FeeInvoice;
 StudentSection = db.models.StudentSection;
 Section = db.models.Section;
 Class = db.models.Class;
 Session = db.models.Session;
 Student = db.models.Student;

function getSectionInvoice(req, res, next) {
    const whereCondition = {
        '$studentSection.session.branch_id$': req.query.branch_id,
    };

    if (req.query.from_date) {
        whereCondition.generate_date = {
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


    FeeInvoice.findAll({
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
                as: 'student'
            }]
        }],
        where: whereCondition,
        order: 'created_at DESC'
    }).then((result) => {
        res.json({
            status: true,
            message: 'Invoice listed successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = getSectionInvoice;
