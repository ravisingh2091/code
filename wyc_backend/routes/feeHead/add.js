const db = require('../../database');
const FeeHead = db.models.FeeHead;

function add(req, res, next) {
    const data = req.body;

    FeeHead.findOrCreate({
        defaults: {
            branch_id: req.query.branch_id,
            name: data.name,
            periodicity: data.periodicity
        }, where: {
            branch_id: req.query.branch_id,
            name: data.name
        }
    }).then((feeHead) => {
        if (feeHead[1]) {
            res.json({
                status: true,
                message: 'Fee head created successfully'
            });
        } else {
            res.json({
                status: false,
                message: 'Fee head already exist'
            });
        }
    }).catch((err) => {
        next(err);
    });
}

module.exports = add;
