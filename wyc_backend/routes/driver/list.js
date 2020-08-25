const db = require('../../database');
const Driver = db.models.Driver;

function get(req, res, next) {
    const whereCondition = { branch_id: req.query.branch_id };

    if (req.query.emp_type) {
        whereCondition.type = req.query.emp_type;
    }

    Driver.findAll({
        where: whereCondition
    }).then((result) => {
        res.json({
            status: true,
            message: 'Driver info listed successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = get;
