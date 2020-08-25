const db = require('../../database');
const Term = db.models.Term;

function add(req, res, next) {
    const data = {
        branch_id: req.query.branch_id,
        name: req.body.name
    };

    Term.findOrCreate({
        defaults: data,
        where: data
    }).then((result) => {
        if (result[1]) {
            return res.json({
                status: true,
                message: 'Term name added successfully'
            });
        }
        res.json({
            status: false,
            message: 'Term name already exist'
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = add;
