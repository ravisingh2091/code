const db = require('../../database');
const FeeStructure = db.models.FeeStructure;

function addFeeStructure(req, res, next) {
    const data = {
        branch_id:req.query.branch_id,
        name: req.body.name
    };

    FeeStructure.findOrCreate({
        defaults: data,
        where: data
    }).then((structure) => {
        if (structure[1]) {
            return res.json({
                status: true,
                message: 'Fee structure added successfully'
            });
        }
        res.json({
            status: false,
            message: 'Fee structure name already exist'
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = addFeeStructure;
