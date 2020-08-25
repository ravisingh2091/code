const db = require('../../database');
const FeeCategory = db.models.FeeCategory;

function get(req, res, next) {
    FeeCategory.findOne({ where: { id: req.params.id } }).then((result) => {
        res.json({
            status: true,
            message: 'Fee Category get successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = get;
