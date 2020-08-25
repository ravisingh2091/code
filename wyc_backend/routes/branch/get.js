const db = require('../../database');
const Branch = db.models.Branch;
const School = db.models.School;

function get(req, res, next) {
    const branch_id = req.query.id ? req.query.id : req.query.branch_id;
    Branch.findOne({
        include: {
            required: true,
            model: School,
            as: 'school'
        },
        where: {
            id: branch_id
        }
    }).then((result) => {
        res.json({
            status: true,
            message: 'Branch info get successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = get;
