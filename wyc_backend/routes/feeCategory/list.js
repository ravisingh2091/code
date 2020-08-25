const db = require('../../database');
const FeeCategory = db.models.FeeCategory;

function list(req, res, next) {
    FeeCategory.findAll({ where: { branch_id: req.query.branch_id } }).then((result) => {
        res.json({
            status: true,
            message: 'Fee category listed successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = list;
