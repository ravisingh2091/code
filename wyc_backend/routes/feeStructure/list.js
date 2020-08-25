const db = require('../../database');
const FeeStructure = db.models.FeeStructure;

function list(req, res, next) {
    FeeStructure.findAll({
        where: {
            branch_id: req.query.branch_id
        }
    }).then((result) => {
        return res.json({
            status: true,
            message: 'Fee structure listed successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = list;
