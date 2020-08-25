const db = require('../../database');
const ExtraCollectionHead = db.models.ExtraCollectionHead;

function add(req, res, next) {
    console.log(req.body)
    console.log(req.query)
    ExtraCollectionHead.findOrCreate({
        defaults: {
            session_id: req.body.session_id,
            name: req.body.name,
            description: req.body.description,
            name: req.body.name,
            amount: req.body.amount,
            branch_id:req.query.branch_id
        },
        where: [{
            name: req.body.name
        },{
            branch_id:req.query.branch_id
        }]
    }).then((result) => {
        if (result[1]) {
            res.json({
                status: true,
                message: 'Head added successfully'
            });
        } else {
            res.json({
                status: false,
                message: 'Head name already exist'
            });
        }
    }).catch((err) => {
        next(err);
    });
}

module.exports = add;
