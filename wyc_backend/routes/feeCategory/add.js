const db = require('../../database');
const FeeCategory = db.models.FeeCategory;

function add(req, res, next) {
    const categoryInfo = {
        branch_id: req.query.branch_id,
        name: req.body.name
    };
    FeeCategory.findOrCreate({
        defaults: categoryInfo,
        where: categoryInfo
    }).then((result) => {
        if (result[1]) {
            return res.json({
                status: true,
                message: 'Fee category added successfully'
            });
        }
        res.json({
            status: false,
            message: 'Fee category already exist!'
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = add;
