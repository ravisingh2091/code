const db = require('../../database');
const Session = db.models.Session;

function list(req, res, next) {
    const whereCondition = {
        branch_id: req.query.branch_id
    };

    if (req.query.status === '1') {
        whereCondition.status = 'Present';
    }

    if (req.query.status === '0') {
        whereCondition.$not = {
            status: 'Past'
        };
    }

    if (req.query.status === '2') {
        whereCondition.$not = {
            status: 'Future'
        };
    }

    Session.findAll({
        where: whereCondition,
        order: 'start_date DESC'
    }).then((result) => {
        res.status(200).json({
            status: true,
            message: 'school session listed successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = list;
