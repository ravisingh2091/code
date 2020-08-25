const db = require('../../database');
const FeeStructure = db.models.FeeStructure;

function update(req, res, next) {
    const data = req.body;
    FeeStructure.find({
        where: {
            name: data.name,
            branch_id: req.query.branch_id,
            id: {
                $not: data.id
            }
        }
    }).then((result) => {
        if (!result) {
            return FeeStructure.update({
                name: data.name
            }, { where: { id: data.id } }).then(() => {
                res.json({
                    status: true,
                    message: 'Fee Structure name updated successfully'
                });
            });
        }
        res.json({
            status: false,
            message: 'Fee Structure name already exist'
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = update;
