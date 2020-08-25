const db = require('../../database');
const FeeCategory = db.models.FeeCategory;

function update(req, res, next) {
    FeeCategory.find({
        where: {
            branch_id: req.query.branch_id,
            name: req.body.name,
            $not: {
                id: req.body.id
            }
        }
    }).then((result) => {
        if (!result) {
            return FeeCategory.update({
                branch_id: req.query.branch_id,
                name: req.body.name
            }, { where: { id: req.body.id } }).then(() => {
                return res.json({
                    status: true,
                    message: 'Fee category updated successfully'
                });
            });
        }
        res.json({
            status: true,
            message: 'Fee category already exist!'
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = update;
