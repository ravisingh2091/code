const db = require('../../database');
const Term = db.models.Term;

function list(req, res, next) {
    Term.findAll({
        where: {
            branch_id: req.query.branch_id
        }
    }).then((result) => {
        res.json({
            status: true,
            message: 'School term listed successfully',
            data: result
        });
    }).catch((err) => {
        next(err);
    });
}

module.exports = list;
