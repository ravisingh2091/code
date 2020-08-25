const db = require('../../database');
const FeeStructure = db.models.FeeStructure;

function get(req, res, next) {
    FeeStructure.findById(req.query.structure_id).then((result) => {
        res.json({
            status: true,
            message: 'Fee structure get successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = get;
