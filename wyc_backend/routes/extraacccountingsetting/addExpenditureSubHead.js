const db = require('../../database');
const ExtraExpenditureSubHead = db.models.ExtraExpenditureSubHead;

function add(req, res, next) {
    ExtraExpenditureSubHead.findOrCreate({
        defaults: {
            session_id: req.body.session_id,
            head_id: req.body.head_id,
            name: req.body.name,
            description: req.body.description,
            name: req.body.name,
            branch_id:req.query.branch_id
        },
        where: {
            head_id: req.body.head_id,
            name: req.body.name,
            branch_id:req.query.branch_id
        }
    }).then((result) => {
        if (result[1]) {
            res.json({
                status: true,
                message: 'Head added successfully'
            });
        } else {
            res.json({
                status: false,
                message: 'Sub Head name already in same head exist'
            });
        }
    }).catch((err) => {
        next(err);
    });
}

module.exports = add;
